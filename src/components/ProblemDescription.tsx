import { Problem } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

interface ProblemDescriptionProps {
  problem: Problem;
}

const difficultyColors = {
  Easy: 'bg-success/20 text-success border-success/30',
  Medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Hard: 'bg-destructive/20 text-destructive border-destructive/30',
};

const ProblemDescription = ({ problem }: ProblemDescriptionProps) => {
  return (
    <div className="h-full overflow-y-auto scrollbar-thin p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg md:text-xl font-bold text-foreground">{problem.title}</h2>
        <Badge className={`${difficultyColors[problem.difficulty]} border text-xs`}>
          {problem.difficulty}
        </Badge>
      </div>

      <div className="prose prose-invert prose-sm max-w-none">
        <div className="text-secondary-foreground whitespace-pre-line text-sm leading-relaxed">
          {problem.description}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Examples</h3>
          {problem.examples.map((example, idx) => (
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
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">Constraints</h3>
          <ul className="list-disc list-inside space-y-1">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="text-xs text-muted-foreground font-mono">
                {constraint}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
