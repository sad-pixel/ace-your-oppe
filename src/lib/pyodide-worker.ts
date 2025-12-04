import { loadPyodide, PyodideAPI } from "pyodide";
import { PGlite } from "@electric-sql/pglite";

// ==========================================
// CONFIGURATION
// ==========================================
const BUFFER_SIZE = 5 * 1024 * 1024; // 5MB

// ==========================================
// LOGIC BRANCHING
// ==========================================
const isDbWorker = self.name === "PGlite_SubWorker";

if (isDbWorker) {
  runDatabaseMode();
} else {
  runPythonMode();
}

// ==========================================
// MODE 1: DATABASE SUB-WORKER
// ==========================================
async function runDatabaseMode() {
  let sharedInt32: Int32Array | null = null;
  let sharedUint8: Uint8Array | null = null;

  let dbInstance: PGlite | null = null;

  self.onmessage = async (e: MessageEvent) => {
    const { type, buffer, sql, params } = e.data;

    if (type === "INIT_BUFFER") {
      sharedInt32 = new Int32Array(buffer);
      sharedUint8 = new Uint8Array(buffer);
      return;
    }

    if (type === "SQL_INIT") {
      dbInstance = new PGlite();
      await dbInstance.waitReady;

      const response = await fetch(
        "/db_dumps/" + e.data.database_dump + ".sql",
      );
      console.log(`Fetch response status: ${response.status}`);

      const dumpSql = await response.text();
      console.log(`Database dump loaded, size: ${dumpSql.length} bytes`);

      // Execute the dump on the database
      console.log(`Executing database dump...`);
      await dbInstance.exec(dumpSql);

      // Signal that the database initialization is complete
      if (sharedInt32) {
        Atomics.store(sharedInt32, 2, 1); // Use index 2 for DB init status
        Atomics.notify(sharedInt32, 2);
      }
    }

    if (type === "SQL_REQUEST") {
      if (!sharedUint8 || !sharedInt32) return;

      try {
        const result = await dbInstance.query(sql, params, {
          rowMode: "array",
        });

        console.log(result);

        const responseText = JSON.stringify({
          rows: result.rows,
          fields: result.fields,
          rowCount: result.rows.length,
        });

        const encoder = new TextEncoder();
        const bytes = encoder.encode(responseText);

        if (bytes.length > sharedUint8.length - 8) {
          throw new Error("Result too large for buffer");
        }

        sharedUint8.set(bytes, 8);
        sharedInt32[1] = bytes.length;
        Atomics.store(sharedInt32, 0, 1); // 1 = Success
      } catch (err: any) {
        const errorObj = { error: err.message || "Unknown DB Error" };
        const bytes = new TextEncoder().encode(JSON.stringify(errorObj));
        sharedUint8.set(bytes, 8);
        sharedInt32[1] = bytes.length;
        Atomics.store(sharedInt32, 0, 2); // 2 = Error
      }

      Atomics.notify(sharedInt32, 0);
    }
  };
}

// ==========================================
// MODE 2: PYTHON COORDINATOR
// ==========================================
async function runPythonMode() {
  let pyodide: PyodideAPI;
  let dbWorker: Worker;
  let sharedBuffer: SharedArrayBuffer;
  let sharedInt32: Int32Array;
  let sharedUint8: Uint8Array;

  async function setupEnvironment() {
    sharedBuffer = new SharedArrayBuffer(BUFFER_SIZE);
    sharedInt32 = new Int32Array(sharedBuffer);
    sharedUint8 = new Uint8Array(sharedBuffer);

    dbWorker = new Worker(new URL(import.meta.url), {
      type: "module",
      name: "PGlite_SubWorker",
    });

    dbWorker.postMessage({ type: "INIT_BUFFER", buffer: sharedBuffer });

    pyodide = await loadPyodide();

    // 1. JS BRIDGE
    (self as any).sql_bridge = (query: string, params: unknown) => {
      Atomics.store(sharedInt32, 0, 0);
      dbWorker.postMessage({ type: "SQL_REQUEST", sql: query, params: params });
      Atomics.wait(sharedInt32, 0, 0);

      const status = Atomics.load(sharedInt32, 0);
      const length = sharedInt32[1];
      const decoder = new TextDecoder();
      const bytes = sharedUint8.slice(8, 8 + length);
      const response = JSON.parse(decoder.decode(bytes));

      if (status === 2) throw new Error(response.error);
      return response;
    };

    // Create random environment variables for PostgreSQL connection
    const pgUser = "user_" + Math.random().toString(36).substring(2, 8);
    const pgPassword =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const pgHost = "localhost";
    const pgPort = (Math.floor(Math.random() * 1000) + 5000).toString(); // Random port between 5000-5999
    const pgDbName = "db_" + Math.random().toString(36).substring(2, 10);

    // Inject environment variables through Python's os.environ
    await pyodide.runPythonAsync(`
    import os, sys
    os.environ['PGUSER'] = '${pgUser}'
    os.environ['PGPASSWORD'] = '${pgPassword}'
    os.environ['PGHOST'] = '${pgHost}'
    os.environ['PGPORT'] = '${pgPort}'
    sys.argv.append('${pgDbName}')
    `);

    console.log("PostgreSQL environment variables set:", {
      PGUSER: pgUser,
      PGHOST: pgHost,
      PGPORT: pgPort,
      PGPASSWORD: pgPassword.substring(0, 3) + "...", // Log only part of password for security
    });

    // 2. PYTHON DRIVER MOCK (Updated with Type Conversions)
    await pyodide.runPythonAsync(`
import js, sys, os
from datetime import datetime, date

class FakeCursor:
    def __init__(self):
        self.description = None
        self.rowcount = -1
        self._rows = []
        self._index = 0

    def execute(self, query, params=None):
        js_params = None
        final_query = query

        # 1. Handle Params
        if params:
            if '%s' in final_query:
                cnt = 1
                while '%s' in final_query:
                    final_query = final_query.replace('%s', '$' + str(cnt), 1)
                    cnt += 1
            js_params = js.Array.from_(params)

        try:
            # 2. Call Bridge
            res_proxy = js.sql_bridge(final_query, js_params)
            res = res_proxy.to_py()

            if 'rows' in res:
                raw_rows = res['rows']
                raw_fields = res['fields']

                # Extract names and OIDs (Data Type IDs)
                field_names = [f['name'] for f in raw_fields]
                field_oids = [f['dataTypeID'] for f in raw_fields]

                self.description = [(name,) for name in field_names]
                self._rows = []

                # 3. Convert Rows
                for r in raw_rows:
                    row_data = []
                    for i in range(len(field_names)):
                        val = r[i]
                        oid = field_oids[i]

                        # --- TYPE CONVERSION LOGIC ---
                        # OID 1082 = DATE in Postgres
                        if oid == 1082 and isinstance(val, str):
                            try:
                                # JS sends "1999-05-20T00:00:00.000Z" -> Take first 10 chars
                                val = datetime.strptime(val[:10], '%Y-%m-%d').date()
                            except:
                                pass # Keep as string on failure

                        # Add more OIDs here if needed (e.g. 1114 for TIMESTAMP)

                        row_data.append(val)

                    self._rows.append(tuple(row_data))

                self.rowcount = len(self._rows)
            else:
                self._rows = []

            self._index = 0
        except Exception as e:
            raise Exception(str(e))

    def fetchall(self): return self._rows
    def fetchone(self):
        if self._index < len(self._rows):
            r = self._rows[self._index]
            self._index += 1
            return r
        return None
    def close(self): pass

class FakeConn:
    def cursor(self): return FakeCursor()
    def commit(self): pass
    def close(self): pass

def fake_connect(dsn=None, *args, **kwargs):
    # Get the expected values from environment
    expected_database = sys.argv[1]
    expected_user = os.environ.get('PGUSER')
    expected_password = os.environ.get('PGPASSWORD')
    expected_host = os.environ.get('PGHOST')
    expected_port = os.environ.get('PGPORT')

    # Check if credentials match environment variables
    user = kwargs.get('user', None)
    password = kwargs.get('password', None)
    host = kwargs.get('host', None)
    port = kwargs.get('port', None)
    database = kwargs.get('database', None)

    # Validate credentials
    if not all([
        user == expected_user,
        password == expected_password,
        host == expected_host,
        port == expected_port,
        database == expected_database
    ]):
        error_msg = f"Connection failed: Invalid credentials or connection parameters."
        raise Exception(error_msg)

    return FakeConn()

sys.modules['psycopg2'] = type('psycopg2', (), {
    'connect': fake_connect
})
    `);
  }

  self.onmessage = async (event: MessageEvent) => {
    if (event.data.type === "EXECUTE_PYTHON") {
      try {
        if (!pyodide) await setupEnvironment();

        // Reset database initialization status
        Atomics.store(sharedInt32, 2, 0);

        // Send SQL_INIT message to initialize database
        dbWorker.postMessage({
          type: "SQL_INIT",
          database_dump: event.data.database_dump,
        });

        // Wait for database initialization to complete
        Atomics.wait(sharedInt32, 2, 0);

        // Capture stdout/stderr
        await pyodide.runPythonAsync(`
import io, sys
sys.stdout = io.StringIO()
sys.stderr = sys.stdout
        `);

        // Load custom files if provided
        if (event.data.files) {
          console.log("Loading custom files:", Object.keys(event.data.files));

          for (const [content, filename] of Object.entries(event.data.files)) {
            // Create virtual file system entry
            pyodide.FS.writeFile(filename as string, content as string);
            console.log(`File loaded: ${filename} ${content}`);
          }
        }

        await pyodide.runPythonAsync(event.data.pythonCode);

        const output = await pyodide.runPythonAsync("sys.stdout.getvalue()");
        self.postMessage({ type: "PYTHON_RESULT", result: output });
      } catch (error: any) {
        // Attempt to read traceback from buffer if execution failed
        let traceback = "";
        try {
          traceback = await pyodide.runPythonAsync("sys.stdout.getvalue()");
        } catch (e) {
          // Silently handle errors when trying to get traceback
        }

        self.postMessage({
          type: "PYTHON_ERROR",
          error: traceback || error.message,
        });
      }
    }
  };
}
