import { Badge } from "@/components/ui/badge";

import { inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "server";
import { SchemaVisualizer } from "@/components/SchemaVisualizer";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ProblemOutput = RouterOutput["getProblemSetById"]["problems"][number];

interface ProblemDescriptionProps {
  problem: ProblemOutput;
}

const problemTypeColors = {
  python: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  sql: "bg-green-500/20 text-green-400 border-green-500/30",
};

const exampleSchema = {
  tables: [
    {
      id: "teams",
      name: "teams",
      columns: [
        { name: "team_id", type: "VARCHAR(10)", isPrimary: true },
        { name: "name", type: "VARCHAR(80)" },
        { name: "city", type: "VARCHAR(80)" },
        { name: "playground", type: "VARCHAR(80)" },
        { name: "jersey_home_color", type: "VARCHAR(80)" },
        { name: "jersey_away_color", type: "VARCHAR(80)" },
      ],
    },
    {
      id: "managers",
      name: "managers",
      columns: [
        { name: "mgr_id", type: "VARCHAR(10)", isPrimary: true },
        { name: "name", type: "VARCHAR(80)" },
        { name: "dob", type: "DATE" },
        { name: "team_id", type: "VARCHAR(10)", isForeign: true },
        { name: "since", type: "DATE" },
      ],
    },
    {
      id: "matches",
      name: "matches",
      columns: [
        { name: "match_num", type: "VARCHAR(10)", isPrimary: true },
        { name: "match_date", type: "DATE" },
        { name: "host_team_id", type: "VARCHAR(10)", isForeign: true },
        { name: "guest_team_id", type: "VARCHAR(10)", isForeign: true },
        { name: "host_team_score", type: "INTEGER" },
        { name: "guest_team_score", type: "INTEGER" },
      ],
    },
    {
      id: "match_referees",
      name: "match_referees",
      columns: [
        {
          name: "match_num",
          type: "VARCHAR(10)",
          isPrimary: true,
          isForeign: true,
        },
        { name: "referee", type: "VARCHAR(15)" },
        { name: "assistant_referee_1", type: "VARCHAR(15)" },
        { name: "assistant_referee_2", type: "VARCHAR(15)" },
        { name: "fourth_referee", type: "VARCHAR(15)" },
      ],
    },
    {
      id: "referees",
      name: "referees",
      columns: [
        { name: "referee_id", type: "VARCHAR(10)", isPrimary: true },
        { name: "name", type: "VARCHAR(80)" },
        { name: "dob", type: "DATE" },
      ],
    },
    {
      id: "players",
      name: "players",
      columns: [
        { name: "player_id", type: "VARCHAR(10)", isPrimary: true },
        { name: "name", type: "VARCHAR(80)" },
        { name: "dob", type: "DATE" },
        { name: "jersey_no", type: "INTEGER" },
        { name: "team_id", type: "VARCHAR(10)", isForeign: true },
      ],
    },
  ],
  relationships: [
    {
      source: "teams",
      target: "managers",
      sourceColumn: "team_id",
      targetColumn: "team_id",
    },
    {
      source: "teams",
      target: "players",
      sourceColumn: "team_id",
      targetColumn: "team_id",
    },
    {
      source: "teams",
      target: "matches",
      sourceColumn: "team_id",
      targetColumn: "host_team_id",
    },
    {
      source: "teams",
      target: "matches",
      sourceColumn: "team_id",
      targetColumn: "guest_team_id",
    },
    {
      source: "matches",
      target: "match_referees",
      sourceColumn: "match_num",
      targetColumn: "match_num",
    },
  ],
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
            Database Schema
          </h3>

          {/*<div className="w-full h-96">
            <SchemaVisualizer schema={exampleSchema} />
          </div>*/}

          {/*{problem.examples.map((example, idx) => (
            <div key={idx} className="bg-secondary/50 rounded-lg p-4 mb-3 border border-border">
              <div className="mb-2">
                <span className="text-muted-foreground text-xs">Input:</span>
                <code className="block font-mono text-xs text-primary mt-1 bg-background/50 p-2 rounded">
                  {example.input}
                </code>
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Output:</span>
                <code className="block font-mono text-xs text-success mt-1 bg-background/50 p-2 rounded">
                  {example.output}
                </code>
              </div>
              {example.explanation && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <span className="font-medium">Explanation:</span> {example.explanation}
                </div>
              )}
            </div>
          ))}*/}
        </div>

        {/*<div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Constraints
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="text-xs text-muted-foreground font-mono">
                {constraint}
              </li>
            ))}
          </ul>
        </div>*/}
      </div>
    </div>
  );
};

export default ProblemDescription;
