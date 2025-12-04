import { cn } from "@/lib/utils";
import { CheckCircle, Circle, ChevronLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import { AppRouter } from "../../server";
import { inferRouterOutputs } from "@trpc/server";

type RouterOutput = inferRouterOutputs<AppRouter>;
type ProblemSet = NonNullable<RouterOutput["getProblemSetById"]>;
type Problem = ProblemSet["problems"][number];

interface ProblemSidebarProps {
  problems: Problem[];
  selectedProblemId: string | null;
  onSelectProblem: (problemId: string) => void;
  problemSetTitle: string;
  isOpen: boolean;
  onToggle: () => void;
}

const problemTypeColors = {
  python: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  sql: "bg-green-500/20 text-green-400 border-green-500/30",
};

const ProblemSidebar = ({
  problems,
  selectedProblemId,
  onSelectProblem,
  problemSetTitle,
  isOpen,
  onToggle,
}: ProblemSidebarProps) => {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto",
          "w-64 lg:w-72 bg-sidebar border-r border-sidebar-border",
          "flex flex-col h-full",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "hidden lg:-translate-x-full",
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <Link
            to="/problemsets"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs">Back to Problem Sets</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <h2 className="font-semibold text-base text-foreground truncate">
              {problemSetTitle}
            </h2>
          </div>
          <div className="flex items-center mt-1 ml-11">
            <div className="text-sm text-muted-foreground">
              <span className="font-bold">{problems.length}</span> problems
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          {problems.map((problem, idx) => (
            <button
              key={problem.id}
              onClick={() => {
                onSelectProblem(problem.id.toString());
                if (window.innerWidth < 1024) onToggle();
              }}
              className={cn(
                "w-full text-left p-3 rounded-lg mb-1 transition-all",
                "flex items-center gap-3 group",
                selectedProblemId === problem.id.toString()
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50 text-sidebar-foreground",
              )}
            >
              <div className="flex items-center justify-center w-6 h-6 text-xs font-medium text-muted-foreground">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">
                    Question {problem.questionNo}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      problemTypeColors[
                        problem.type as keyof typeof problemTypeColors
                      ],
                    )}
                  >
                    {problem.type.toUpperCase()}
                  </span>
                </div>
              </div>
              <Circle className="w-4 h-4 text-muted-foreground/50" />
            </button>
          ))}
        </div>
      </aside>
    </>
  );
};

export default ProblemSidebar;
