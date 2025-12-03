import { loadPyodide, PyodideAPI } from "pyodide";
import { PGlite } from "@electric-sql/pglite";

let db: PGlite | null = null;
let pyodide: PyodideAPI | null = null;

async function runPythonCode(
  env: Record<string, string> = {},
  files: Record<string, string> = {},
  pythonCode: string,
  database_dump?: string,
): Promise<string> {
  try {
    console.log("Trying to run code");
    // Initialize Pyodide
    pyodide = await loadPyodide({
      env: env,
    });

    // Initialize PGlite database
    db = new PGlite();
    await db.waitReady;

    try {
      console.log(`Loading database dump: ${database_dump}`);

      // Fetch the database dump file
      const response = await fetch("/db_dumps/" + database_dump + ".sql");
      console.log(`Fetch response status: ${response.status}`);

      const dumpSql = await response.text();
      console.log(`Database dump loaded, size: ${dumpSql.length} bytes`);

      // Execute the dump on the database
      console.log(`Executing database dump...`);
      await db.exec(dumpSql);
      console.log(`Database dump execution completed successfully`);

      self.postMessage({
        type: "DB_DUMP_LOADED",
        success: true,
      });
      console.log(`Notified main thread of successful dump load`);
    } catch (error) {
      console.error(`Error loading database dump: ${error.message}`);
      self.postMessage({
        type: "DB_DUMP_ERROR",
        error: error.message,
      });
      console.error(`Notified main thread of dump load error`);
      throw error; // Re-throw to abort the process
    }

    // Create files from the files object
    if (files && Object.keys(files).length > 0) {
      for (const [filepath, content] of Object.entries(files)) {
        pyodide.FS.writeFile(filepath, content);
      }
    }

    // Make the database instance accessible to Python
    pyodide.globals.set("PGlite_db", db);

    // Create a fake psycopg2 module to interface with PGlite
    await pyodide.runPythonAsync(`
class FakePsycopg2Connection:
    def __init__(self, js_db):
        self.js_db = js_db
        self.autocommit = False
        self._transaction_status = 0  # IDLE

    def cursor(self):
        return FakePsycopg2Cursor(self.js_db)

    def commit(self):
        self._transaction_status = 0  # IDLE

    def rollback(self):
        self._transaction_status = 0  # IDLE

    def close(self):
        pass

class FakePsycopg2Cursor:
    def __init__(self, js_db):
        self.js_db = js_db
        self.description = None
        self.rowcount = -1
        self._rows = []
        self._index = 0

    def execute(self, query, params=None):
        import js
        try:
            if params:
                # Convert params to JavaScript array if it's a tuple or list
                if isinstance(params, (list, tuple)):
                    js_params = js.Array.from_(params)
                else:
                    js_params = params

                result = self.js_db.query(query, js_params)
            else:
                result = self.js_db.query(query)

            if result and hasattr(result, 'rows'):
                self._rows = result.rows
                self.rowcount = len(self._rows)

                # Set up description if available
                if hasattr(result, 'fields') and result.fields:
                    self.description = [
                        (field.name, None, None, None, None, None, None)
                        for field in result.fields
                    ]
                else:
                    self.description = None
            else:
                self._rows = []
                # For operations like INSERT/UPDATE/DELETE
                if hasattr(result, 'rowCount'):
                    self.rowcount = result.rowCount

            self._index = 0
            return self
        except Exception as e:
            print(f"SQL Error: {e}")
            raise

    def fetchone(self):
        if self._index >= len(self._rows):
            return None
        row = self._rows[self._index]
        self._index += 1
        return row

    def fetchall(self):
        remaining = self._rows[self._index:]
        self._index = len(self._rows)
        return remaining

    def fetchmany(self, size=None):
        if size is None:
            size = 1
        end = min(self._index + size, len(self._rows))
        result = self._rows[self._index:end]
        self._index = end
        return result

    def close(self):
        self._rows = []

# Create the psycopg2 module
class FakePsycopg2:
    def __init__(self):
        self.extensions = type('extensions', (), {
            'ISOLATION_LEVEL_AUTOCOMMIT': 0,
            'TRANSACTION_STATUS_IDLE': 0
        })

    def connect(self, *args, **kwargs):
        return FakePsycopg2Connection(PGlite_db)

# Register the module
import sys
sys.modules['psycopg2'] = FakePsycopg2()`);

    // Run the Python code
    // Redirect Python stdout and stderr to capture output
    await pyodide.runPythonAsync(`
      import io
      import sys

      class CaptureOutput:
          def __init__(self):
              self.stdout = io.StringIO()
              self.stderr = io.StringIO()
              self.original_stdout = sys.stdout
              self.original_stderr = sys.stderr

          def __enter__(self):
              sys.stdout = self.stdout
              sys.stderr = self.stderr
              return self

          def __exit__(self, exc_type, exc_val, exc_tb):
              sys.stdout = self.original_stdout
              sys.stderr = self.original_stderr

          def get_output(self):
              return self.stdout.getvalue() + self.stderr.getvalue()

      output_capture = CaptureOutput()
    `);

    // Execute the Python code with output capturing
    await pyodide.runPythonAsync(`
      with output_capture:
          exec(${JSON.stringify(pythonCode)})
    `);

    // Get the captured output
    const result = await pyodide.runPythonAsync(`output_capture.get_output()`);

    console.log("Python execution completed successfully");
    return result;
  } catch (error) {
    console.error("Error running Python code:", error);
    throw error;
  }
}

// Web Worker Context
self.addEventListener("message", async (event) => {
  // You can handle specific commands from the main thread here
  if (event.data.type === "EXECUTE_PYTHON") {
    console.log(event);

    try {
      // Execute the Python code with provided environment and files
      const result = await runPythonCode(
        event.data.env || {},
        event.data.files || {},
        event.data.pythonCode,
        event.data.database_dump,
      );

      // Notify the main thread that the database is ready
      self.postMessage({
        type: "DB_READY",
        databaseId: Date.now().toString(),
      });

      // Send the result back to the main thread
      self.postMessage({
        type: "PYTHON_RESULT",
        result,
      });
    } catch (error) {
      // Send error back to the main thread
      self.postMessage({
        type: "PYTHON_ERROR",
        error: error.message,
      });
    }
  }
});
