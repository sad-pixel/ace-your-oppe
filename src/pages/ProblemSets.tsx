import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  FileQuestion,
  Pencil,
  Brain,
} from "lucide-react";
// import { problemSets } from '@/data/mockData';
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

const setTypeColors = {
  PYQ: "bg-success/20 text-success border-success/30",
  PA: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Ace: "bg-destructive/20 text-destructive border-destructive/30",
};

// Icons for different problem set types
const setTypeIcons = {
  PYQ: FileQuestion,
  PA: Pencil,
  Ace: Brain,
};

// ProblemSet Card component
const ProblemSetCard = ({ set }) => {
  const IconComponent = setTypeIcons[set.type] || BookOpen;

  return (
    <Link
      key={set.id}
      to={`/problemset/${set.id}`}
      className="group bg-card border border-border rounded-xl p-4 card-hover flex items-center gap-3 max-w-xs"
    >
      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
        <IconComponent className="w-5 h-5 text-primary" />
      </div>

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex flex-wrap items-center gap-1 mb-1">
          <h2 className="font-semibold text-base text-foreground truncate">
            {set.name}
          </h2>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2">
        <div className="text-right">
          <div className="text-lg font-bold text-foreground">
            {set.problemCount}
          </div>
          <div className="text-xs text-muted-foreground">problems</div>
        </div>
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
    </Link>
  );
};

// ProblemSetColumn component
const ProblemSetColumn = ({ title, type, problemSets }) => {
  const filteredSets = problemSets.filter((set) => set.type === type);
  const totalProblems = filteredSets.reduce(
    (acc, set) => acc + Number(set.problemCount),
    0,
  );

  return (
    <div>
      <div className="mb-6 pb-4 border-b border-border">
        <div className="flex gap-3 mb-2">
          <h3 className="font-bold text-xl text-foreground">{title}</h3>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="text-xs font-medium">
            {filteredSets.length} sets
          </Badge>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm gradient-text font-medium">
            {totalProblems} problems
          </span>
        </div>
      </div>
      <div className="grid gap-4">
        {filteredSets.map((set) => (
          <ProblemSetCard key={set.id} set={set} />
        ))}
      </div>
    </div>
  );
};

const ProblemSets = () => {
  const problemSets = useQuery(trpc.getAllProblemSets.queryOptions());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Problem Sets
            </h1>
            <p className="text-muted-foreground">
              Choose a problem set to start practicing
            </p>
          </div>

          <div>
            {!problemSets.isLoading && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ProblemSetColumn
                  title="PYQ"
                  type="PYQ"
                  problemSets={problemSets.data}
                />
                <ProblemSetColumn
                  title="PA"
                  type="PA"
                  problemSets={problemSets.data}
                />
                <ProblemSetColumn
                  title="AceMyOPPE"
                  type="Ace"
                  problemSets={problemSets.data}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemSets;
