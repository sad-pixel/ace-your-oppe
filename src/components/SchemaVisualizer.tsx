"use client";

import { useMemo } from "react";
import ReactFlow, {
  type Node,
  type Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { TableNode } from "@/components/TableNode";

export interface Column {
  name: string;
  type: string;
  isPrimary?: boolean;
  isForeign?: boolean;
}

export interface Table {
  id: string;
  name: string;
  columns: Column[];
}

export interface Relationship {
  source: string;
  target: string;
  sourceColumn: string;
  targetColumn: string;
}

export interface SchemaData {
  tables: Table[];
  relationships: Relationship[];
}

interface SchemaVisualizerProps {
  schema: SchemaData;
}

export function SchemaVisualizer({ schema }: SchemaVisualizerProps) {
  // Create nodes from tables
  const initialNodes: Node[] = useMemo(() => {
    const tablesPerRow = 3;
    const spacing = 400;

    return schema.tables.map((table, index) => ({
      id: table.id,
      data: { table },
      position: {
        x: (index % tablesPerRow) * spacing,
        y: Math.floor(index / tablesPerRow) * 300,
      },
      type: "table",
    }));
  }, [schema.tables]);

  // Create edges from relationships
  const initialEdges: Edge[] = useMemo(() => {
    return schema.relationships.map((rel, index) => ({
      id: `edge-${index}`,
      source: rel.source,
      target: rel.target,
      animated: false,
      markerEnd: { type: MarkerType.ArrowClosed },
      // label: `${rel.sourceColumn} → ${rel.targetColumn}`,
      labelStyle: {
        fontSize: "14px",
        fill: "hsl(var(--foreground))",
        fontWeight: 500,
      },
      style: {
        strokeWidth: 2,
        stroke: "hsl(var(--primary))",
      },
    }));
  }, [schema.relationships]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(() => ({ table: TableNode }), []);

  return (
    <div style={{ width: "100%", height: "100%" }} className="bg-background">
      <ReactFlow
        nodes={nodes}
        // edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        {/*<Background />*/}
        {/*<Controls />*/}
      </ReactFlow>
    </div>
  );
}
