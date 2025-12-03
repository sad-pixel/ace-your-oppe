import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Menu, Play, Send } from 'lucide-react';
import { problems, problemSets } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import ProblemSidebar from '@/components/ProblemSidebar';
import ProblemDescription from '@/components/ProblemDescription';
import CodeEditor from '@/components/CodeEditor';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ProblemSetView = () => {
  const { setId } = useParams<{ setId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const problemSet = problemSets.find((ps) => ps.id === setId);
  const problemList = setId ? problems[setId] : [];
  const selectedProblem = problemList?.find((p) => p.id === selectedProblemId);

  useEffect(() => {
    if (problemList?.length > 0 && !selectedProblemId) {
      setSelectedProblemId(problemList[0].id);
    }
  }, [problemList, selectedProblemId]);

  useEffect(() => {
    if (selectedProblem) {
      setCode(selectedProblem.starterCode);
    }
  }, [selectedProblem]);

  if (!problemSet || !problemList) {
    return <Navigate to="/problemsets" replace />;
  }

  const handleRunCode = () => {
    toast({
      title: 'Running code...',
      description: 'Your code is being executed.',
    });
  };

  const handleSubmit = () => {
    toast({
      title: 'Submitting solution...',
      description: 'Your solution is being evaluated.',
    });
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-border bg-card flex items-center px-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-5 h-5" />
        </Button>
        <span className="font-semibold gradient-text">AceMyOPPE</span>
        {selectedProblem && (
          <span className="ml-4 text-sm text-muted-foreground hidden sm:block">
            / {selectedProblem.title}
          </span>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <ProblemSidebar
          problems={problemList}
          selectedProblemId={selectedProblemId}
          onSelectProblem={setSelectedProblemId}
          problemSetTitle={problemSet.title}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Problem Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {selectedProblem ? (
            <>
              {/* Problem Description */}
              <div className="h-1/2 lg:h-full lg:w-1/2 border-b lg:border-b-0 lg:border-r border-border overflow-hidden">
                <ProblemDescription problem={selectedProblem} />
              </div>

              {/* Code Editor Section */}
              <div className="h-1/2 lg:h-full lg:w-1/2 flex flex-col overflow-hidden">
                <div className="flex-1 p-2 md:p-4 overflow-hidden">
                  <CodeEditor value={code} onChange={setCode} />
                </div>

                {/* Action Buttons */}
                <div className="p-3 md:p-4 border-t border-border bg-card flex items-center justify-end gap-3 shrink-0">
                  <Button variant="outline" onClick={handleRunCode}>
                    <Play className="w-4 h-4" />
                    <span className="hidden sm:inline">Run Code</span>
                    <span className="sm:hidden">Run</span>
                  </Button>
                  <Button variant="success" onClick={handleSubmit}>
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">Submit Solution</span>
                    <span className="sm:hidden">Submit</span>
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a problem to get started
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemSetView;
