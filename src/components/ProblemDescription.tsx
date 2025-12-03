import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "server";
import { SchemaVisualizer } from "@/components/SchemaVisualizer";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ProblemOutput = RouterOutput["getProblemSetById"]["problems"][number];

interface ProblemDescriptionProps {
  problem: ProblemOutput;
}

const problemTypeColors = {
  python: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  sql: "bg-green-500/20 text-green-400 border-green-500/30",
};

const ProblemDescription = ({ problem }: ProblemDescriptionProps) => {
  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg md:text-xl font-bold text-foreground">
          Question {problem.questionNo}
        </h2>
        <Badge className={`${problemTypeColors[problem.type]} border text-xs`}>
          {problem.type.toUpperCase()}
        </Badge>
      </div>

      <div className="prose prose-invert prose-sm max-w-none">
        <div className="text-secondary-foreground whitespace-pre-line text-sm leading-relaxed">
          {problem.question}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            {problem.type === "python"
              ? "Database Information"
              : "Database Schema (Click to Enlarge)"}
          </h3>

          {problem.type === "python" ? (
            <div className="border rounded-md">
              <Tabs defaultValue="schema">
                <TabsList className="border-b w-full flex rounded-none bg-transparent h-auto p-0">
                  <TabsTrigger
                    value="schema"
                    className="px-4 py-2 rounded-none data-[state=active]:bg-secondary data-[state=active]:shadow-none"
                  >
                    Schema
                  </TabsTrigger>
                  <TabsTrigger
                    value="connection"
                    className="px-4 py-2 rounded-none data-[state=active]:bg-secondary data-[state=active]:shadow-none"
                  >
                    Connection Instructions
                  </TabsTrigger>
                </TabsList>
                <div className="p-4">
                  <TabsContent value="schema" className="mt-0">
                    <div className="overflow-x-auto">
                      <Dialog>
                        <DialogTrigger asChild>
                          <img
                            src={`/db_schemas/${problem.databaseName}.png`}
                            alt="Database Schema"
                            className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                          />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[80vw] p-0 bg-background">
                          <img
                            src={`/db_schemas/${problem.databaseName}.png`}
                            alt="Database Schema"
                            className="w-full h-auto"
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TabsContent>
                  <TabsContent value="connection" className="mt-0">
                    <div className="bg-muted p-3 rounded text-sm font-mono">
                      <pre className="whitespace-pre-wrap">{`database = sys.argv[1] # name of the database isobtained from the command line argument
user = os.environ.get('PGUSER')
password = os.environ.get('PGPASSWORD')
host = os.environ.get('PGHOST')
port = os.environ.get('PGPORT')`}</pre>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Dialog>
                <DialogTrigger asChild>
                  <img
                    src={`/db_schemas/${problem.databaseName}.png`}
                    alt="Database Schema"
                    className="max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-[80vw] p-0 bg-background">
                  <img
                    src={`/db_schemas/${problem.databaseName}.png`}
                    alt="Database Schema"
                    className="w-full h-auto"
                  />
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
