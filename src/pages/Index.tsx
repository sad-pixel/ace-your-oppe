import { Link } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  Zap,
  Target,
  Trophy,
  Database,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Stats } from "@/components/Stats";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/trpc";

const Index = () => {
  const homepageStats = useQuery(trpc.getHomeStatistics.queryOptions());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-secondary/50 border border-border rounded-full px-4 py-2 mb-6">
              <Database className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                First platform for DBMS OPPE prep
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Practice <span className="gradient-text">SQL & Python-DB</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Practice both SQL queries and Python-Postgres connectivity
              directly in your browser, just like in the actual DBMS OPPE exam.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/problemsets">
                  Start Practicing
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/playground">Use Code Editor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}

      <section className="border-t border-border">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <Stats
            stats={[
              {
                id: "stat-1",
                value: homepageStats.data?.totalProblemSets.toString() || "0",
                label: "Problem sets available",
              },
              {
                id: "stat-2",
                value: homepageStats.data?.totalProblems.toString() || "0",
                label: "Total problems to practice",
              },
              {
                id: "stat-3",
                value: homepageStats.data?.totalSqlProblems.toString() || "0",
                label: "SQL problems",
              },
              {
                id: "stat-4",
                value:
                  homepageStats.data?.totalPythonProblems.toString() || "0",
                label: "Python-DB problems",
              },
            ]}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Built for DBMS OPPE Preparation
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Created by students, for students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 card-hover">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Python-DB Practice</h3>
              <p className="text-sm text-muted-foreground">
                The only platform where you can practice connecting Python to
                PostgreSQL directly in your browser – exactly like in the OPPE.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 card-hover">
              <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Exam-Pattern Questions
              </h3>
              <p className="text-sm text-muted-foreground">
                Problems that match the format and difficulty of actual OPPE
                questions, created by students who've taken the exam.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 card-hover">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Realistic Environment
              </h3>
              <p className="text-sm text-muted-foreground">
                Practice in a setting that mimics the exam interface, with the
                same constraints and requirements you'll face in the OPPE.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Prepare for Your <span className="gradient-text">DBMS OPPE</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Don't just study the concepts—practice actual implementation. Get
              comfortable with SQL queries and Python-DB connections before your
              exam.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/problemsets">
                Start Practicing Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()}. Created by{" "}
            <a
              href="https://ishan.page"
              className="text-primary hover:underline"
            >
              Ishan
            </a>
            . Not affiliated with IIT Madras or IIT BS Degree in any official
            manner.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
