import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
// import { problemSets } from '@/data/mockData';
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

const difficultyColors = {
  Beginner: "bg-success/20 text-success border-success/30",
  Intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Advanced: "bg-destructive/20 text-destructive border-destructive/30",
};

const ProblemSets = () => {
  const problemSets = useQuery(trpc.getAllProblemSets.queryOptions());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Problem Sets
            </h1>
            <p className="text-muted-foreground">
              Choose a problem set to start practicing
            </p>
          </div>

          <div className="grid gap-4">
            {!problemSets.isLoading &&
              problemSets.data.map((set) => (
                <Link
                  key={set.id}
                  to={`/problemset/${set.id}`}
                  className="group bg-card border border-border rounded-xl p-6 card-hover flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h2 className="font-semibold text-lg text-foreground">
                        {set.name}
                      </h2>
                      <Badge
                        className={`${difficultyColors["Beginner"]} border text-xs`}
                      >
                        {"Beginner"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      This is a big problem problemset
                    </p>
                    {/*<div className="flex flex-wrap gap-2">
                    {set.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-xs bg-secondary px-2 py-1 rounded text-secondary-foreground"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>*/}
                  </div>

                  <div className="hidden sm:flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">
                        {set.problemCount}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        problems
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProblemSets;
