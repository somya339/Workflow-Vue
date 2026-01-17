import type { Node } from "@vue-flow/core";
import type { NodeData } from "./nodes";

export interface WorkflowNode extends Node {
  data: NodeData;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  style?: any;
  label?: string;
}

export interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  isExecuting: boolean;
}

export interface ExecutionLog {
  nodeId: string;
  nodeLabel: string;
  nodeType: string;
  input: any;
  output: any;
  timestamp: number;
}

export interface WorkflowExport {
  version: string;
  timestamp: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface HistoryState {
  past: WorkflowState[];
  future: WorkflowState[];
}
