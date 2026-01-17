import { defineStore } from "pinia";
import type {
  WorkflowNode,
  WorkflowState,
  WorkflowExport,
} from "../types/workflow";
import type { NodeData } from "../types/nodes";

export const useWorkflowStore = defineStore("workflow", {
  state: (): WorkflowState => ({
    nodes: [],
    edges: [],
    selectedNodeId: null,
    isExecuting: false,
  }),

  getters: {
    selectedNode(state): WorkflowNode | undefined {
      return state.nodes.find((node) => node.id === state.selectedNodeId);
    },

    getNodeById:
      (state) =>
      (id: string): WorkflowNode | undefined => {
        return state.nodes.find((node) => node.id === id);
      },

    connectedNodes: (state) => (nodeId: string) => {
      const incoming = state.edges
        .filter((edge) => edge.target === nodeId)
        .map((edge) => state.nodes.find((node) => node.id === edge.source))
        .filter(Boolean);

      const outgoing = state.edges
        .filter((edge) => edge.source === nodeId)
        .map((edge) => state.nodes.find((node) => node.id === edge.target))
        .filter(Boolean);

      return { incoming, outgoing };
    },

    startNode(state): WorkflowNode | undefined {
      return state.nodes.find((node) => node.type === "start");
    },

    canExecute(state): boolean {
      const hasStartNode = state.nodes.some((node) => node.type === "start");
      const hasEndNode = state.nodes.some((node) => node.type === "end");
      return hasStartNode && hasEndNode && state.nodes.length >= 2;
    },
  },

  actions: {
    addNode(type: string, position: { x: number; y: number }, data: NodeData) {
      const id = `${type}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
      const newNode: WorkflowNode = {
        id,
        type,
        position,
        data,
      };
      this.nodes = [...this.nodes, newNode];
      return id;
    },

    updateNode(id: string, data: Partial<NodeData>) {
      const nodeIndex = this.nodes.findIndex((n) => n.id === id);
      if (nodeIndex !== -1 && this.nodes[nodeIndex]) {
        const currentNode = this.nodes[nodeIndex];
        const updatedNode: WorkflowNode = {
          ...currentNode,
          data: { ...currentNode.data, ...data } as NodeData,
        };
        this.nodes = [
          ...this.nodes.slice(0, nodeIndex),
          updatedNode,
          ...this.nodes.slice(nodeIndex + 1),
        ];
      }
    },

    updateNodePosition(id: string, position: { x: number; y: number }) {
      const nodeIndex = this.nodes.findIndex((n) => n.id === id);
      if (nodeIndex !== -1 && this.nodes[nodeIndex]) {
        const currentNode = this.nodes[nodeIndex];
        const updatedNode: WorkflowNode = {
          ...currentNode,
          position: { ...position },
        };
        this.nodes = [
          ...this.nodes.slice(0, nodeIndex),
          updatedNode,
          ...this.nodes.slice(nodeIndex + 1),
        ];
      }
    },

    deleteNode(id: string) {
      this.nodes = this.nodes.filter((n) => n.id !== id);
      this.edges = this.edges.filter((e) => e.source !== id && e.target !== id);
      if (this.selectedNodeId === id) {
        this.selectedNodeId = null;
      }
    },

    addEdge(source: string, target: string) {
      const edgeExists = this.edges.some(
        (e) => e.source === source && e.target === target,
      );
      if (edgeExists) return;

      const sourceNode = this.nodes.find((n) => n.id === source);
      const targetNode = this.nodes.find((n) => n.id === target);

      if (!sourceNode || !targetNode) return;

      if (sourceNode.type === "end") {
        return;
      }

      if (targetNode.type === "start") {
        return;
      }

      const targetHasInput = this.edges.some(
        (e) => e.target === target && e.id !== `e${source}-${target}`,
      );
      if (targetHasInput) {
        return;
      }

      const id = `e${source}-${target}`;
      this.edges = [...this.edges, { id, source, target }];
    },

    removeEdge(id: string) {
      this.edges = this.edges.filter((e) => e.id !== id);
    },

    setSelectedNode(id: string | null) {
      this.selectedNodeId = id;
    },

    setExecuting(value: boolean) {
      this.isExecuting = value;
    },

    exportWorkflow(): WorkflowExport {
      return {
        version: "1.0.0",
        timestamp: Date.now(),
        nodes: this.nodes,
        edges: this.edges,
      };
    },

    importWorkflow(data: WorkflowExport) {
      this.nodes = data.nodes || [];
      this.edges = data.edges || [];
      this.selectedNodeId = null;
      this.isExecuting = false;
    },

    clearWorkflow() {
      this.nodes = [];
      this.edges = [];
      this.selectedNodeId = null;
      this.isExecuting = false;
    },
  },
});
