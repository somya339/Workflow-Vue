import type {
  NodeType,
  NodeData,
  StartNodeData,
  TransformNodeData,
  EndNodeData,
} from "../types/nodes";

export function createNodeData(type: NodeType): NodeData {
  switch (type) {
    case "start":
      return {
        label: "Start",
        payload: '{"message": "hello"}',
      } as StartNodeData;

    case "transform":
      return {
        label: "Transform",
        operation: "uppercase",
        value: undefined,
      } as TransformNodeData;

    case "end":
      return {
        label: "End",
        receivedPayload: null,
      } as EndNodeData;

    default:
      throw new Error(`Unknown node type: ${type}`);
  }
}

export function getNodeDefaults(type: NodeType) {
  return {
    type,
    data: createNodeData(type),
  };
}
