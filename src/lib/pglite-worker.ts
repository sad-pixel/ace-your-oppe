import { PGlite } from "@electric-sql/pglite";

// Web Worker Context
let db: PGlite | null = null;

self.addEventListener("message", async (event) => {
  // You can handle specific commands from the main thread here
  if (event.data.type === "EXECUTE_QUERY") {
    console.log(event);

    // Create database instance if it doesn't exist
    if (!db) {
      // Create a new in-memory PGlite database
      db = new PGlite();

      // Initialize the database
      await db.waitReady;

      try {
        console.log(`Loading database dump: ${event.data.database_dump}`);

        // Fetch the database dump file
        const response = await fetch(
          "/db_dumps/" + event.data.database_dump + ".sql",
        );
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
        return; // Exit if database initialization fails
      }
    }

    // Notify the main thread that the database is ready
    self.postMessage({
      type: "DB_READY",
      databaseId: Date.now().toString(),
    });

    // Execute the query on the initialized database
    try {
      const result = await db.query(event.data.sql, [], { rowMode: "array" });
      console.log("Golden solution: ", event.data.golden);
      const goldenResult = event.data.golden
        ? await db.query(event.data.golden, [], {
            rowMode: "array",
          })
        : null;
      self.postMessage({
        type: "QUERY_RESULT",
        result,
        goldenResult,
      });
    } catch (error) {
      self.postMessage({
        type: "QUERY_ERROR",
        error: error.message,
      });
    }
  }
});
