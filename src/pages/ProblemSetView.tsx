import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Menu, Play, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ProblemSidebar from "@/components/ProblemSidebar";
import ProblemDescription from "@/components/ProblemDescription";
import CodeEditor from "@/components/CodeEditor";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

// Import Worker
import PGLiteWorker from "@/lib/pglite-worker.ts?worker";

const ProblemSetView = () => {
  const { setId } = useParams<{ setId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null,
  );
  const [code, setCode] = useState("-- Enter Your SQL Query here!");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  // const {problemSet} = problemSets.find((ps) => ps.id === setId);
  const { data, isLoading } = useQuery(
    trpc.getProblemSetById.queryOptions(setId),
  );

  const problemList = useMemo(() => data?.problems ?? [], [data?.problems]);
  const setName = useMemo(() => data?.name ?? "Loading...", [data?.name]);

  // Find the selected problem by ID instead of using the ID as an array index
  const selectedProblem = useMemo(
    () =>
      problemList.find(
        (problem) => problem.id.toString() === selectedProblemId,
      ),
    [problemList, selectedProblemId],
  );

  useEffect(() => {
    if (problemList?.length > 0 && !selectedProblemId) {
      setSelectedProblemId(problemList[0].id.toString());
    }
  }, [problemList, selectedProblemId]);

  useEffect(() => {
    if (selectedProblem) {
      setCode("-- Enter Your Code Here");
    }
  }, [selectedProblem]);

  // Initialize the PGLite worker
  useEffect(() => {
    // Create worker
    workerRef.current = new PGLiteWorker();

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
        toast({
          title: "Query executed successfully",
          description: "Your query has been executed.",
        });
      } else if (type === "QUERY_ERROR") {
        setIsExecuting(false);
        toast({
          title: "Error executing query",
          description: error,
          variant: "destructive",
        });
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

  // if (!isLoading || !problemList) {
  //   return <Navigate to="/problemsets" replace />;
  // }

  const handleRunCode = () => {
    if (!workerRef.current) {
      toast({
        title: "Database not ready",
        description: "Please wait for the database to initialize.",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    toast({
      title: "Running code...",
      description: "Your code is being executed.",
    });

    workerRef.current.postMessage({
      type: "EXECUTE_QUERY",
      sql: code,
      database_dump: selectedProblem.databaseName,
    });
  };

  const handleSubmit = () => {
    if (!workerRef.current) {
      toast({
        title: "Database not ready",
        description: "Please wait for the database to initialize.",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    toast({
      title: "Submitting solution...",
      description: "Your solution is being evaluated.",
    });

    workerRef.current.postMessage({
      type: "EXECUTE_QUERY",
      sql: code,
      database_dump: selectedProblem.databaseName,
    });

    // Compare the hash of the result with the expected hash
    workerRef.current.onmessage = async (event) => {
      const { type, result, error } = event.data;

      if (type === "QUERY_RESULT") {
        // Generate hash from the result
        const resultString = JSON.stringify(result.rows);
        const encoder = new TextEncoder();
        const data = encoder.encode(resultString);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash = hashArray
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        // Compare hash with expected answer (assuming selectedProblem has an expectedHash)
        if (hash === selectedProblem.solutionHash) {
          toast({
            title: "Correct solution!",
            description: "Your solution matches the expected result.",
            variant: "default",
          });
        } else {
          toast({
            title: "Incorrect solution",
            description: "Your solution does not match the expected result.",
            variant: "destructive",
          });
        }

        setQueryResult(result);
        setIsExecuting(false);
      } else if (type === "QUERY_ERROR") {
        setIsExecuting(false);
        toast({
          title: "Error executing query",
          description: error,
          variant: "destructive",
        });
      }
    };
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <span className="font-semibold gradient-text">AceMyOPPE</span>
        {selectedProblem && (
          <span className="ml-4 text-sm text-muted-foreground hidden sm:block">
            / Question {selectedProblem.questionNo}
          </span>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ProblemSidebar
          problems={problemList}
          selectedProblemId={selectedProblemId}
          onSelectProblem={setSelectedProblemId}
          problemSetTitle={setName}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Problem Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {selectedProblem ? (
            <>
              {/* Problem Description */}
              <div className="h-1/2 lg:h-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border overflow-hidden">
                <ProblemDescription problem={selectedProblem} />
              </div>

              {/* Code Editor Section */}
              <div className="h-1/2 lg:h-full lg:w-1/2 flex flex-col overflow-hidden">
                <div className="flex-1 p-2 md:p-4 overflow-hidden">
                  <CodeEditor value={code} onChange={setCode} />
                </div>

                {/* Query Results Section */}
                {queryResult && (
                  <div className="p-3 max-h-60 overflow-auto border-t border-border">
                    <h3 className="text-sm font-medium mb-2">Query Result:</h3>
                    {queryResult.rows && queryResult.fields ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {queryResult.fields.map((field, index) => (
                                <TableHead key={index}>{field.name}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {queryResult.rows.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <TableCell key={cellIndex}>
                                    {cell === null ? "NULL" : String(cell)}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <pre className="text-xs overflow-x-auto">
                        {JSON.stringify(queryResult, null, 2)}
                      </pre>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="p-3 md:p-4 border-t border-border bg-card flex items-center justify-end gap-3 shrink-0">
                  <Button
                    variant="outline"
                    onClick={handleRunCode}
                    disabled={isExecuting}
                  >
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">Run Code</span>
                    <span className="sm:hidden">Run</span>
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={isExecuting}
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Submit Solution</span>
                    <span className="sm:hidden">Submit</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a problem to get started
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSetView;
