import { useState, useMemo } from "react";
import CodeEditor from "../components/CodeEditor";
import {
  Play,
  Database,
  Terminal,
  Trash2,
  BookOpen,
  GraduationCap,
  ShoppingCart,
  Trophy,
  Eye,
  Info,
  CogIcon,
} from "lucide-react";
import { useCodeExecution } from "../hooks/use-code-execution";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

export default function Playground() {
  const [languageMode, setLanguageMode] = useState<"sql" | "python">("sql");
  const [code, setCode] = useState(
    "-- Write your SQL query here\nSELECT * FROM users LIMIT 10;",
  );
  const [database, setDatabase] = useState("lis");
  const [error, setError] = useState<string | null>(null);
  const [schemaDialogOpen, setSchemaDialogOpen] = useState(false);
  const [connectionInfoOpen, setConnectionInfoOpen] = useState(false);

  const selectedProblem = useMemo(
    () => ({
      id: -1,
      databaseName: database,
      solutionHash: "",
      type: languageMode,
    }),
    [database, languageMode],
  );

  const { queryResult, pythonResult, isExecuting, runCode } =
    useCodeExecution(selectedProblem);

  const handleRunCode = async () => {
    setError(null);

    try {
      await runCode(code);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    }
  };

  const handleLanguageChange = (mode: "sql" | "python") => {
    setLanguageMode(mode);
    setError(null);
    if (mode === "sql") {
      setCode("-- Write your SQL query here\nSELECT * FROM users LIMIT 10;");
    } else {
      setCode("# Write your Python code here\nprint('Hello, World!')");
    }
  };

  return (
    <div className="max-h-screen bg-background overflow-hidden">
      <Navbar />
      <div className="flex h-screen w-full flex-col bg-background p-4 gap-4 text-foreground">
        {/* Header Controls */}
        {/* Desktop Header Controls */}
        <div className="hidden md:flex items-center justify-between rounded-lg p-0 px-14 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Database Selection */}
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-muted-foreground" />
              <Select value={database} onValueChange={setDatabase}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select database" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lis">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span>LIS</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="flis">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      <span>FLIS</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="university">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      <span>University</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="eshop">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4" />
                      <span>Eshop</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Language Toggle */}
            <div className="flex rounded-md border border-input p-1">
              <button
                onClick={() => handleLanguageChange("sql")}
                className={`rounded-sm px-3 py-1 text-sm font-medium transition-colors ${
                  languageMode === "sql"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                SQL
              </button>
              <button
                onClick={() => handleLanguageChange("python")}
                className={`rounded-sm px-3 py-1 text-sm font-medium transition-colors ${
                  languageMode === "python"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Python
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button onClick={() => setSchemaDialogOpen(true)} variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View Schema
            </Button>
            {languageMode === "python" && (
              <Button
                onClick={() => setConnectionInfoOpen(true)}
                variant="outline"
              >
                <Info className="mr-2 h-4 w-4" />
                Connection Info
              </Button>
            )}
            <Button onClick={() => setCode("")} variant="outline">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear
            </Button>
            <Button onClick={handleRunCode} disabled={isExecuting}>
              {isExecuting ? (
                <span>Running...</span>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Code
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Header Controls */}
        <div className="md:hidden flex flex-col gap-2 rounded-lg p-0 shadow-sm">
          <div className="flex items-center justify-between">
            {/* Database Selection - Mobile */}
            <Select value={database} onValueChange={setDatabase}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Database" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lis">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>LIS</span>
                  </div>
                </SelectItem>
                <SelectItem value="flis">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    <span>FLIS</span>
                  </div>
                </SelectItem>
                <SelectItem value="university">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    <span>University</span>
                  </div>
                </SelectItem>
                <SelectItem value="eshop">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Eshop</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {/* Language Toggle - Mobile */}
            <div className="flex rounded-md border border-input p-1">
              <button
                onClick={() => handleLanguageChange("sql")}
                className={`rounded-sm px-2 py-1 text-sm font-medium transition-colors ${
                  languageMode === "sql"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                SQL
              </button>
              <button
                onClick={() => handleLanguageChange("python")}
                className={`rounded-sm px-2 py-1 text-sm font-medium transition-colors ${
                  languageMode === "python"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                Python
              </button>
            </div>

            {/* Run Button - Mobile */}
            <Button onClick={handleRunCode} disabled={isExecuting} size="sm">
              {isExecuting ? (
                <span>Running...</span>
              ) : (
                <>
                  <Play className="mr-1 h-4 w-4" />
                  Run
                </>
              )}
            </Button>
          </div>

          {/* Secondary Actions - Mobile */}
          <div className="flex items-center gap-2 mt-1">
            <Button
              onClick={() => setSchemaDialogOpen(true)}
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
            >
              <Eye className="mr-1 h-3 w-3" />
              Schema
            </Button>
            {languageMode === "python" && (
              <Button
                onClick={() => setConnectionInfoOpen(true)}
                variant="outline"
                size="sm"
                className="flex-1 h-8 text-xs"
              >
                <Info className="mr-1 h-3 w-3" />
                Connect Info
              </Button>
            )}
            <Button
              onClick={() => setCode("")}
              variant="outline"
              size="sm"
              className="flex-1 h-8 text-xs"
            >
              <Trash2 className="mr-1 h-3 w-3" />
              Clear
            </Button>
          </div>
        </div>
        {/* Editor and Output Area */}
        <div className="flex-1 flex-grow overflow-hidden">
          {/* Mobile view - shown only on mobile devices */}
          <div className="md:hidden">
            <ResizablePanelGroup
              direction="vertical"
              className="min-h-[80vh] rounded-lg border"
            >
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="flex h-full flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Editor
                    </span>
                  </div>
                  <div className="flex-1">
                    <CodeEditor
                      languageMode={languageMode}
                      value={code}
                      onChange={setCode}
                      readOnly={false}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="flex h-full flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Output
                    </span>
                  </div>
                  <div className="h-full w-full overflow-auto rounded-lg border border-border bg-card p-4 font-mono text-sm shadow-sm">
                    {error ? (
                      <div className="text-red-500">
                        <span className="font-bold">Error:</span> {error}
                      </div>
                    ) : languageMode === "sql" && queryResult ? (
                      <div className="w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                          <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              {queryResult.fields.map((field) => (
                                <th
                                  key={field.name}
                                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                                >
                                  {field.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="[&_tr:last-child]:border-0">
                            {queryResult.rows.map((row, i) => (
                              <tr
                                key={i}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                              >
                                {row.map((val, j) => (
                                  <td
                                    key={j}
                                    className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                                  >
                                    {typeof val === "object"
                                      ? JSON.stringify(val)
                                      : String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : languageMode === "python" && pythonResult !== null ? (
                      <pre className="whitespace-pre-wrap">{pythonResult}</pre>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                        <Terminal className="mb-2 h-8 w-8 opacity-50" />
                        <p>Run code to see output</p>
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>

          {/* Desktop view - shown only on medium screens and above */}
          <div className="hidden md:block">
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[80vh] rounded-lg border"
            >
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="flex h-full flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Editor
                    </span>
                  </div>
                  <div className="flex-1">
                    <CodeEditor
                      languageMode={languageMode}
                      value={code}
                      onChange={setCode}
                      readOnly={false}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="flex h-full flex-col gap-2 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Output
                    </span>
                  </div>
                  <div className="h-full w-full overflow-auto rounded-lg border border-border bg-card p-4 font-mono text-sm shadow-sm">
                    {error ? (
                      <div className="text-red-500">
                        <span className="font-bold">Error:</span> {error}
                      </div>
                    ) : languageMode === "sql" && queryResult ? (
                      <div className="w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                          <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                              {queryResult.fields.map((field) => (
                                <th
                                  key={field.name}
                                  className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                                >
                                  {field.name}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="[&_tr:last-child]:border-0">
                            {queryResult.rows.map((row, i) => (
                              <tr
                                key={i}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                              >
                                {row.map((val, j) => (
                                  <td
                                    key={j}
                                    className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                                  >
                                    {typeof val === "object"
                                      ? JSON.stringify(val)
                                      : String(val)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : languageMode === "python" && pythonResult !== null ? (
                      <pre className="whitespace-pre-wrap">{pythonResult}</pre>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                        <Terminal className="mb-2 h-8 w-8 opacity-50" />
                        <p>Run code to see output</p>
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
        {/* Schema Dialog */}
        <Dialog open={schemaDialogOpen} onOpenChange={setSchemaDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Database Schema - {database}</DialogTitle>
            </DialogHeader>
            <div className="flex items-center justify-center">
              <img
                src={`/db_schemas/${database}.png`}
                alt={`${database} schema`}
                className="max-w-full h-auto"
              />
            </div>
          </DialogContent>
        </Dialog>
        {/* Connection Info Dialog */}
        <Dialog open={connectionInfoOpen} onOpenChange={setConnectionInfoOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Database Connection Information</DialogTitle>
            </DialogHeader>
            <div className="bg-muted p-3 rounded text-sm font-mono">
              <pre className="whitespace-pre-wrap">{`database = sys.argv[1] # name of the database isobtained from the command line argument
user = os.environ.get('PGUSER')
password = os.environ.get('PGPASSWORD')
host = os.environ.get('PGHOST')
port = os.environ.get('PGPORT')`}</pre>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
