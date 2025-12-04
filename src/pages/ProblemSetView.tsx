import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  CheckCircle2,
  Loader2,
  Menu,
  Play,
  Send,
  XIcon,
  Eye,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProblemSidebar from "@/components/ProblemSidebar";
import ProblemDescription from "@/components/ProblemDescription";
import CodeEditor from "@/components/CodeEditor";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";
import { useCodeExecution } from "@/hooks/use-code-execution";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ProblemSetView = () => {
  const { setId } = useParams<{ setId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth > 1024; // 768px is the sm breakpoint
    }
    return false; // Default to false for SSR
  });

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 1024);
    };

    // Set initial value
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null,
  );
  const [code, setCode] = useState("-- Enter Your SQL Query here!");
  const [queryError, setQueryError] = useState<string | null>(null);
  const [solutionDialogOpen, setSolutionDialogOpen] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);

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
      setSolution(null);
    }
  }, [selectedProblem]);

  // Use our custom hook with the selected problem
  const {
    queryResult,
    pythonResult,
    isExecuting,
    isSolutionCorrect,
    runCode,
    submitSolution,
  } = useCodeExecution(
    selectedProblem ?? {
      id: 0,
      databaseName: "",
      solutionHash: "",
      type: "python",
    },
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

  const handleViewSolution = () => {
    setSolutionDialogOpen(true);
  };

  const confirmViewSolution = async () => {
    // Here you would fetch the solution from your backend
    // For now, let's just simulate loading a solution
    if (selectedProblem) {
      // In a real app, you'd fetch this from your API
      setSolution(selectedProblem.golden || "Solution not available");
    }
    setSolutionDialogOpen(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="mr-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? (
            <PanelLeftCloseIcon className="w-8 h-8" />
          ) : (
            <PanelLeftOpenIcon className="w-8 h-8" />
          )}
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
          onToggle={() => {
            console.log("Toggling sidebar:", !sidebarOpen);
            setSidebarOpen(!sidebarOpen);
          }}
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
                  {solution ? (
                    <CodeEditor
                      languageMode={selectedProblem.type}
                      value={solution}
                      onChange={() => {}} // Read-only
                      readOnly={true}
                    />
                  ) : (
                    <CodeEditor
                      languageMode={selectedProblem.type}
                      value={code}
                      onChange={setCode}
                      readOnly={false}
                    />
                  )}
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

                  {/* Show results based on problem type */}
                  {selectedProblem.type === "sql"
                    ? // SQL Query Results
                      queryResult && (
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
                                      (
                                        field: { name: string },
                                        index: number,
                                      ) => (
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
                                          (
                                            cell: unknown,
                                            cellIndex: number,
                                          ) => (
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
                      )
                    : // Python Code Results
                      pythonResult !== null && (
                        <>
                          <h3 className="text-sm font-medium mb-2">
                            Python Output:
                          </h3>
                          <div className="rounded-md border p-3 bg-muted font-mono text-sm whitespace-pre-wrap overflow-auto">
                            {pythonResult}
                          </div>
                        </>
                      )}

                  {!queryResult &&
                    !pythonResult &&
                    !queryError &&
                    !isExecuting && (
                      <div className="text-muted-foreground text-sm">
                        Run your{" "}
                        {selectedProblem.type === "sql" ? "query" : "code"} to
                        see results
                      </div>
                    )}

                  {isExecuting && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2">
                        Executing{" "}
                        {selectedProblem.type === "sql" ? "query" : "code"}...
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-3 md:p-4 border-t border-border bg-card flex items-center justify-end gap-3 shrink-0">
                  {solution ? (
                    <Button variant="outline" onClick={() => setSolution(null)}>
                      Return to Editor
                    </Button>
                  ) : (
                    <>
                      <Button variant="secondary" onClick={handleViewSolution}>
                        <Eye className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">View Solution</span>
                        <span className="sm:hidden">Solution</span>
                      </Button>
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
                        <span className="hidden sm:inline">
                          Run{" "}
                          {selectedProblem.type === "sql" ? "Query" : "Code"}
                        </span>
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
                        <span className="hidden sm:inline">
                          Submit Solution
                        </span>
                        <span className="sm:hidden">Submit</span>
                      </Button>
                    </>
                  )}
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

      {/* Solution Confirmation Dialog */}
      <Dialog open={solutionDialogOpen} onOpenChange={setSolutionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>View Solution</DialogTitle>
            <DialogDescription>
              Are you sure you want to view the solution? This will reveal the
              answer to the problem.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setSolutionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmViewSolution}>Yes, Show Solution</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProblemSetView;
