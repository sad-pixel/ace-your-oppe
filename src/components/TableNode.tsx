import { Handle, Position } from "reactflow";
import type { Table } from "@/components/SchemaVisualizer";

interface TableNodeProps {
  data: {
    table: Table;
  };
}

export function TableNode({ data }: TableNodeProps) {
  const { table } = data;

  return (
    <div className="bg-card border-2 border-border rounded-lg overflow-hidden shadow-lg min-w-64">
      {/* Table Header */}
      <div className="bg-primary text-primary-foreground px-4 py-3 font-semibold text-center">
        {table.name}
      </div>

      {/* Columns List */}
      <div className="divide-y divide-border">
        {table.columns.map((column, index) => (
          <div
            key={`${table.id}-${column.name}-${index}`}
            className="px-4 py-2 text-sm flex items-center justify-between bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {/* Primary Key Badge */}
              {column.isPrimary && (
                <span
                  className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-destructive text-destructive-foreground rounded-full flex-shrink-0"
                  title="Primary Key"
                >
                  PK
                </span>
              )}
              {/* Foreign Key Badge */}
              {column.isForeign && (
                <span
                  className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-accent text-accent-foreground rounded-full flex-shrink-0"
                  title="Foreign Key"
                >
                  FK
                </span>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-mono text-foreground truncate">
                  {column.name}
                </div>
              </div>
            </div>
            <div className="text-muted-foreground font-mono text-xs ml-2 flex-shrink-0">
              {column.type}
            </div>
          </div>
        ))}
      </div>

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
