import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, Loader2, Menu, Play, Send, XIcon } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { useCodeExecution } from "@/hooks/use-code-execution";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProblemSetView = () => {
  const { setId } = useParams<{ setId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null,
  );
  const [code, setCode] = useState("-- Enter Your SQL Query here!");
  const [queryError, setQueryError] = useState<string | null>(null);

  const { data } = useQuery(trpc.getProblemSetById.queryOptions(setId));

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
      setCode(
        selectedProblem?.type === "sql"
          ? "-- Enter Your SQL Query here!"
          : "# Enter Your Python Code here!",
      );
      setQueryError(null);
    }
  }, [selectedProblem]);

  // Use our custom hook with the selected problem
  const {
    queryResult,
    isExecuting,
    isSolutionCorrect,
    runCode,
    submitSolution,
  } = useCodeExecution(
    selectedProblem ?? { id: 0, databaseName: "", solutionHash: "" },
  );

  const handleRunCode = async () => {
    setQueryError(null);
    try {
      await runCode(code);
    } catch (error) {
      if (error instanceof Error) {
        setQueryError(error.message);
      } else {
        setQueryError("An unknown error occurred");
      }
    }
  };

  const handleSubmit = async () => {
    setQueryError(null);
    try {
      await submitSolution(code);
    } catch (error) {
      if (error instanceof Error) {
        setQueryError(error.message);
      } else {
        setQueryError("An unknown error occurred");
      }
    }
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
                  <CodeEditor
                    languageMode={selectedProblem.type}
                    value={code}
                    onChange={setCode}
                  />
                </div>

                {/* Query Results Section */}
                <div className="p-3 max-h-60 overflow-auto border-t border-border">
                  <div className="py-3">
                    {/* Show query error if it exists, otherwise show solution feedback */}
                    {queryError ? (
                      <Alert variant="destructive">
                        <AlertDescription>{queryError}</AlertDescription>
                      </Alert>
                    ) : (
                      isSolutionCorrect !== null && (
                        <Alert
                          variant={
                            isSolutionCorrect ? "default" : "destructive"
                          }
                        >
                          <AlertDescription className="flex items-center">
                            {isSolutionCorrect ? (
                              <>
                                <CheckCircle2 className="text-green-500 mr-2" />
                                Correct solution! Well done!
                              </>
                            ) : (
                              <>
                                <XIcon className="mr-2" />
                                Incorrect solution. Please try again.
                              </>
                            )}
                          </AlertDescription>
                        </Alert>
                      )
                    )}
                  </div>

                  {/* Show query results */}
                  {queryResult && (
                    <>
                      <h3 className="text-sm font-medium mb-2">
                        Query Result:
                      </h3>
                      {queryResult.rows && queryResult.fields ? (
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                {queryResult.fields.map(
                                  (field: { name: string }, index: number) => (
                                    <TableHead key={index}>
                                      {field.name}
                                    </TableHead>
                                  ),
                                )}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {queryResult.rows.map(
                                (row: unknown[], rowIndex: number) => (
                                  <TableRow key={rowIndex}>
                                    {row.map(
                                      (cell: unknown, cellIndex: number) => (
                                        <TableCell key={cellIndex}>
                                          {cell === null
                                            ? "NULL"
                                            : String(cell)}
                                        </TableCell>
                                      ),
                                    )}
                                  </TableRow>
                                ),
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <></>
                      )}
                    </>
                  )}

                  {!queryResult && !queryError && !isExecuting && (
                    <div className="text-muted-foreground text-sm">
                      Run your query to see results
                    </div>
                  )}

                  {isExecuting && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2">Executing query...</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-3 md:p-4 border-t border-border bg-card flex items-center justify-end gap-3 shrink-0">
                  <Button
                    variant="outline"
                    onClick={handleRunCode}
                    disabled={isExecuting}
                  >
                    {isExecuting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    <span className="hidden sm:inline">Run Code</span>
                    <span className="sm:hidden">Run</span>
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleSubmit}
                    disabled={isExecuting}
                  >
                    {isExecuting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
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
