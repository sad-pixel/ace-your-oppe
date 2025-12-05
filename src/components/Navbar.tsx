import { Link, useLocation } from "react-router-dom";
import {
  Code,
  Code2,
  FolderOpen,
  Github,
  Home,
  ListTodo,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg gradient-text">AceMyOPPE</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive("/")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            to="/problemsets"
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive("/problemsets")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            Problem Sets
          </Link>
          <Link
            to="/problems"
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive("/problems")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListTodo className="w-4 h-4" />
            All Problems
          </Link>
          <Link
            to="/playground"
            className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive("/playground")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code className="w-4 h-4" />
            Code Editor
          </Link>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://github.com/sad-pixel/ace-your-oppe"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <Github className="w-4 h-4 mr-1" />
              GitHub
            </a>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 animate-fade-in">
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive("/") ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/problemsets"
              className={`text-sm font-medium transition-colors ${
                isActive("/problemsets")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Problem Sets
            </Link>
            {/*<Button variant="outline" size="sm" className="w-fit">
              Sign In
            </Button>*/}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
