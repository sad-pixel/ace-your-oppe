import { Link } from "react-router-dom";
import { ArrowRight, Code2, Zap, Target, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";

const Index = () => {
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
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Practice makes perfect
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ace the <span className="gradient-text">DBMS OPPE</span> with
              <br />
              Confidence
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The only platform that lets you practice both SQL questions and
              Python-DB connectivity problems.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="hero" size="lg">
                <Link to="/problemsets">
                  Start Practicing
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/problemsets">Browse Problems</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Why AceMyOPPE?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to prepare for your programming exam
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-card border border-border rounded-xl p-6 card-hover">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Real Coding Environment
              </h3>
              <p className="text-sm text-muted-foreground">
                Practice in a code editor that mirrors the actual exam
                environment with syntax highlighting and auto-completion.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 card-hover">
              <div className="w-12 h-12 rounded-lg bg-success/20 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold text-lg mb-2">
                Curated Problem Sets
              </h3>
              <p className="text-sm text-muted-foreground">
                Carefully selected problems organized by topic and difficulty to
                match OPPE patterns.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 card-hover">
              <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                <Trophy className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your improvement and identify areas that need more
                practice.
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
              Ready to <span className="gradient-text">Ace</span> Your Exam?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of students who have improved their coding skills
              with AceMyOPPE.
            </p>
            <Button asChild variant="hero" size="lg">
              <Link to="/problemsets">
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 AceMyOPPE. Built for students, by students.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
