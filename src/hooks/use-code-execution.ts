// Import Workers
import PGLiteWorker from "@/lib/pglite-worker.ts?worker";
import PyodideWorker from "@/lib/pyodide-worker.ts?worker";
import { useState, useRef, useEffect } from "react";

// Define an interface for query result based on PGlite query response
interface QueryResult {
  rows: unknown[][];
  fields: { name: string; dataTypeID: number }[];
  rowCount: number;
  command: string;
  oid: number | null;
}

// Custom hook for code execution logic
export const useCodeExecution = (selectedProblem: {
  id: number;
  databaseName: string;
  solutionHash: string;
  type?: string;
  dataFileName?: string;
  dataFileContents?: string;
}) => {
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [pythonResult, setPythonResult] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSolutionCorrect, setIsSolutionCorrect] = useState<boolean | null>(
    null,
  );
  const workerRef = useRef<Worker | null>(null);

  // Initialize the appropriate worker based on problem type
  useEffect(() => {
    // Create worker based on problem type
    const problemType = selectedProblem.type || "sql";
    console.log("Problem type: ", selectedProblem.type);
    if (problemType === "python") {
      workerRef.current = new PyodideWorker();
    } else {
      workerRef.current = new PGLiteWorker();
    }

    // Set up event listener
    workerRef.current.onmessage = (event) => {
      const { type, result, error } = event.data;

      if (type === "DB_READY") {
        console.log("Database is ready");
      } else if (type === "DB_DUMP_LOADED") {
        console.log("Database dump loaded successfully");
      } else if (type === "QUERY_RESULT") {
        setQueryResult(result);
        setIsExecuting(false);
      } else if (type === "QUERY_ERROR") {
        setIsExecuting(false);
        console.error("Query error:", error);
      } else if (type === "PYTHON_RESULT") {
        setPythonResult(result);
        setIsExecuting(false);
      } else if (type === "PYTHON_ERROR") {
        setIsExecuting(false);
        console.error("Python error:", error);
      }
    };

    // Cleanup worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [selectedProblem]);

  const runCode = (code: string) => {
    if (!workerRef.current) {
      console.error("Worker not ready");
      return Promise.reject(new Error("Worker not ready"));
    }

    setIsExecuting(true);
    setIsSolutionCorrect(null);

    return new Promise<void>((resolve, reject) => {
      const messageHandler = (event: MessageEvent) => {
        const { type, result, error } = event.data;

        if (type === "QUERY_RESULT") {
          setQueryResult(result);
          setIsExecuting(false);
          // ONLY remove listener when the specific task is done
          workerRef.current?.removeEventListener("message", messageHandler);
          resolve();
        } else if (type === "QUERY_ERROR") {
          setIsExecuting(false);
          console.error("Query error:", error);
          // ONLY remove listener when the specific task is done
          workerRef.current?.removeEventListener("message", messageHandler);
          reject(new Error(error));
        } else if (type === "PYTHON_RESULT") {
          setPythonResult(result);
          setIsExecuting(false);
          workerRef.current?.removeEventListener("message", messageHandler);
          resolve();
        } else if (type === "PYTHON_ERROR") {
          setIsExecuting(false);
          console.error("Python error:", error);
          workerRef.current?.removeEventListener("message", messageHandler);
          reject(new Error(error));
        }

        // If the message is "DB_DUMP_LOADED" or "DB_READY",
        // we do NOTHING and keep the listener active.
      };

      workerRef.current?.addEventListener("message", messageHandler);

      const problemType = selectedProblem.type || "sql";

      if (problemType === "python") {
        // Prepare files for Python execution
        const files = {};
        if (selectedProblem.dataFileName && selectedProblem.dataFileContents) {
          files[selectedProblem.dataFileName] =
            selectedProblem.dataFileContents;
        }

        console.log(files);

        workerRef.current.postMessage({
          type: "EXECUTE_PYTHON",
          pythonCode: code,
          database_dump: selectedProblem.databaseName,
          env: {},
          files: files,
        });
      } else {
        workerRef.current.postMessage({
          type: "EXECUTE_QUERY",
          sql: code,
          database_dump: selectedProblem.databaseName,
        });
      }
    });
  };

  const submitSolution = async (code: string) => {
    if (!workerRef.current) {
      console.error("Worker not ready");
      return Promise.reject(new Error("Worker not ready"));
    }

    setIsExecuting(true);

    // Create a promise to handle the worker response
    const submitPromise = new Promise<void>((resolve, reject) => {
      const messageHandler = async (event: MessageEvent) => {
        const { type, result, error } = event.data;
        const problemType = selectedProblem.type || "sql";

        if (type === "QUERY_RESULT" || type === "PYTHON_RESULT") {
          try {
            // Generate hash from the result
            let resultString = "";

            if (problemType === "python") {
              resultString = String(result);
              setPythonResult(result);
            } else {
              resultString = JSON.stringify(result.rows);
              setQueryResult(result);
            }

            const encoder = new TextEncoder();
            const data = encoder.encode(resultString);
            const hashBuffer = await crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hash = hashArray
              .map((b) => b.toString(16).padStart(2, "0"))
              .join("");

            // Compare hash with expected answer
            const isCorrect = hash === selectedProblem.solutionHash;
            console.log("current hash: ", hash);
            setIsSolutionCorrect(isCorrect);
            setIsExecuting(false);
            workerRef.current?.removeEventListener("message", messageHandler);
            resolve();
          } catch (err) {
            setIsExecuting(false);
            workerRef.current?.removeEventListener("message", messageHandler);
            console.error("Hash generation error:", err);
            reject(err);
          }
        } else if (type === "QUERY_ERROR" || type === "PYTHON_ERROR") {
          setIsExecuting(false);
          setIsSolutionCorrect(false);
          workerRef.current?.removeEventListener("message", messageHandler);
          console.error(
            `${problemType === "python" ? "Python" : "Query"} error:`,
            error,
          );
          reject(new Error(error));
        }
      };

      // Add temporary event listener for this submission
      workerRef.current?.addEventListener("message", messageHandler);

      const problemType = selectedProblem.type || "sql";

      if (problemType === "python") {
        workerRef.current.postMessage({
          type: "EXECUTE_PYTHON",
          pythonCode: code,
          database_dump: selectedProblem.databaseName,
          env: selectedProblem.env || {},
          files: selectedProblem.files || {},
        });
      } else {
        workerRef.current.postMessage({
          type: "EXECUTE_QUERY",
          sql: code,
          database_dump: selectedProblem.databaseName,
        });
      }
    });

    return submitPromise;
  };

  return {
    queryResult,
    pythonResult,
    isExecuting,
    isSolutionCorrect,
    runCode,
    submitSolution,
  };
};
