export type NodeType = "start" | "transform" | "end";

export type TransformOperation =
  | "uppercase"
  | "lowercase"
  | "append"
  | "multiply";

export interface BaseNodeData {
  label: string;
}

export interface StartNodeData extends BaseNodeData {
  payload: string;
}

export interface TransformNodeData extends BaseNodeData {
  operation: TransformOperation;
  value?: string | number;
}

export interface EndNodeData extends BaseNodeData {
  receivedPayload?: any;
}

export type NodeData = StartNodeData | TransformNodeData | EndNodeData;

export interface NodeTemplate {
  type: NodeType;
  label: string;
  description: string;
  icon: string;
}
