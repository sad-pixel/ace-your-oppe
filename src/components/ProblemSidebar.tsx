import { Problem } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { CheckCircle, Circle, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProblemSidebarProps {
  problems: Problem[];
  selectedProblemId: string | null;
  onSelectProblem: (problemId: string) => void;
  problemSetTitle: string;
  isOpen: boolean;
  onToggle: () => void;
}

const difficultyDot = {
  Easy: 'bg-success',
  Medium: 'bg-yellow-500',
  Hard: 'bg-destructive',
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
          'fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto',
          'w-64 lg:w-72 bg-sidebar border-r border-sidebar-border',
          'flex flex-col h-full',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/problemsets" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-2">
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs">Back to Problem Sets</span>
          </Link>
          <h2 className="font-semibold text-foreground truncate">{problemSetTitle}</h2>
          <p className="text-xs text-muted-foreground mt-1">{problems.length} problems</p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
          {problems.map((problem, idx) => (
            <button
              key={problem.id}
              onClick={() => {
                onSelectProblem(problem.id);
                if (window.innerWidth < 1024) onToggle();
              }}
              className={cn(
                'w-full text-left p-3 rounded-lg mb-1 transition-all',
                'flex items-center gap-3 group',
                selectedProblemId === problem.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'hover:bg-sidebar-accent/50 text-sidebar-foreground'
              )}
            >
              <div className="flex items-center justify-center w-6 h-6 text-xs font-medium text-muted-foreground">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{problem.title}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn('w-2 h-2 rounded-full', difficultyDot[problem.difficulty])} />
                  <span className="text-xs text-muted-foreground">{problem.difficulty}</span>
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
