import type { WorkflowState } from "../types/workflow";

export function areStatesEqual(
  state1: WorkflowState,
  state2: WorkflowState
): boolean {
  if (state1.nodes.length !== state2.nodes.length) return false;
  if (state1.edges.length !== state2.edges.length) return false;

  for (let i = 0; i < state1.nodes.length; i++) {
    const node1 = state1.nodes[i];
    const node2 = state2.nodes[i];

    if (node1?.id !== node2?.id) return false;
    if (node1?.type !== node2?.type) return false;
    if (Math.abs(node1?.position?.x - node2?.position?.x) > 1) return false;
    if (Math.abs(node1?.position?.y - node2?.position?.y) > 1) return false;
    if (JSON.stringify(node1?.data) !== JSON.stringify(node2?.data))
      return false;
  }

  for (let i = 0; i < state1.edges.length; i++) {
    const edge1 = state1.edges[i];
    const edge2 = state2.edges[i];

    if (edge1?.id !== edge2?.id) return false;
    if (edge1?.source !== edge2?.source) return false;
    if (edge1?.target !== edge2?.target) return false;
  }

  return true;
}

export function serializeState(state: WorkflowState): string {
  const simplifiedState = {
    nodes: state.nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: {
        x: Math.round(node.position.x),
        y: Math.round(node.position.y),
      },
      data: node.data,
    })),
    edges: state.edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    })),
  };

  return JSON.stringify(simplifiedState);
}
