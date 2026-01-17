import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useWorkflowStore } from "../workflow";

describe("Workflow Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const store = useWorkflowStore();
      expect(store.nodes).toEqual([]);
      expect(store.edges).toEqual([]);
      expect(store.selectedNodeId).toBeNull();
      expect(store.isExecuting).toBe(false);
    });
  });

  describe("Getters", () => {
    it("should return selected node correctly", () => {
      const store = useWorkflowStore();
      const nodeId = store.addNode("start", { x: 0, y: 0 }, { label: "Test Start" });
      store.setSelectedNode(nodeId);

      expect(store.selectedNode?.id).toBe(nodeId);
      expect(store.selectedNode?.type).toBe("start");
    });

    it("should return undefined when no node is selected", () => {
      const store = useWorkflowStore();
      expect(store.selectedNode).toBeUndefined();
    });

    it("should find node by id", () => {
      const store = useWorkflowStore();
      const nodeId = store.addNode("transform", { x: 10, y: 10 }, { label: "Test Transform" });

      const foundNode = store.getNodeById(nodeId);
      expect(foundNode?.id).toBe(nodeId);
      expect(foundNode?.type).toBe("transform");
    });

    it("should return connected nodes", () => {
      const store = useWorkflowStore();
      const startId = store.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      const transformId = store.addNode("transform", { x: 100, y: 0 }, { label: "Transform" });
      const endId = store.addNode("end", { x: 200, y: 0 }, { label: "End" });

      store.addEdge(startId, transformId);
      store.addEdge(transformId, endId);

      const transformConnections = store.connectedNodes(transformId);
      expect(transformConnections.incoming).toHaveLength(1);
      expect(transformConnections.outgoing).toHaveLength(1);
      expect(transformConnections.incoming[0]?.id).toBe(startId);
      expect(transformConnections.outgoing[0]?.id).toBe(endId);
    });

    it("should find start node", () => {
      const store = useWorkflowStore();
      store.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      store.addNode("end", { x: 100, y: 0 }, { label: "End" });

      expect(store.startNode?.type).toBe("start");
    });

    it("should determine if workflow can execute", () => {
      const store = useWorkflowStore();
      expect(store.canExecute).toBe(false);

      store.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      expect(store.canExecute).toBe(false);

      store.addNode("end", { x: 100, y: 0 }, { label: "End" });
      expect(store.canExecute).toBe(true);
    });
  });

  describe("Actions", () => {
    it("should add node with unique id", () => {
      const store = useWorkflowStore();
      const nodeId = store.addNode("start", { x: 50, y: 50 }, { label: "Test Node" });

      expect(nodeId).toMatch(/^start-\d+-[a-z0-9]+$/);
      expect(store.nodes).toHaveLength(1);
      expect(store?.nodes[0]?.id).toBe(nodeId);
      expect(store?.nodes[0]?.type).toBe("start");
      expect(store?.nodes[0]?.position).toEqual({ x: 50, y: 50 });
    });

    it("should update node data", () => {
      const store = useWorkflowStore();
      const nodeId = store.addNode("transform", { x: 0, y: 0 }, { label: "Original" });

      store.updateNode(nodeId, { label: "Updated", operation: "lowercase" });

      const updatedNode = store.getNodeById(nodeId);
      expect(updatedNode?.data.label).toBe("Updated");
      expect((updatedNode?.data as any).operation).toBe("lowercase");
    });

    it("should update node position", () => {
      const store = useWorkflowStore();
      const nodeId = store.addNode("start", { x: 0, y: 0 }, { label: "Start" });

      store.updateNodePosition(nodeId, { x: 150, y: 200 });

      const updatedNode = store.getNodeById(nodeId);
      expect(updatedNode?.position).toEqual({ x: 150, y: 200 });
    });

    it("should delete node and connected edges", () => {
      const store = useWorkflowStore();
      const startId = store.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      const endId = store.addNode("end", { x: 100, y: 0 }, { label: "End" });

      store.addEdge(startId, endId);
      store.setSelectedNode(startId);

      store.deleteNode(startId);

      expect(store.nodes).toHaveLength(1);
      expect(store.edges).toHaveLength(0);
      expect(store.selectedNodeId).toBeNull();
    });

    it("should add edge with validation", () => {
      const store = useWorkflowStore();
      const startId = store.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      const transformId = store.addNode("transform", { x: 100, y: 0 }, { label: "Transform" });

      store.addEdge(startId, transformId);

      expect(store.edges).toHaveLength(1);
      expect(store?.edges[0]?.source).toBe(startId);
      expect(store?.edges[0]?.target).toBe(transformId);
      expect(store?.edges[0]?.id).toBe(`e${startId}-${transformId}`);
    });

    it("should prevent duplicate edges", () => {
      const store = useWorkflowStore();
      const startId = store.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      const transformId = store.addNode("transform", { x: 100, y: 0 }, { label: "Transform" });

      store.addEdge(startId, transformId);
      store.addEdge(startId, transformId);

      expect(store.edges).toHaveLength(1);
    });

    it("should prevent edge from end node", () => {
      const store = useWorkflowStore();
      const endId = store.addNode("end", { x: 0, y: 0 }, { label: "End" });
      const transformId = store.addNode("transform", { x: 100, y: 0 }, { label: "Transform" });

      store.addEdge(endId, transformId);

      expect(store.edges).toHaveLength(0);
    });

    it("should prevent edge to start node", () => {
      const store = useWorkflowStore();
      const startId = store.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      const transformId = store.addNode("transform", { x: 100, y: 0 }, { label: "Transform" });

      store.addEdge(transformId, startId);

      expect(store.edges).toHaveLength(0);
    });

    it("should prevent multiple inputs to same node", () => {
      const store = useWorkflowStore();
      const startId = store.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      const transform1Id = store.addNode("transform", { x: 100, y: 0 }, { label: "Transform 1" });
      const transform2Id = store.addNode("transform", { x: 200, y: 0 }, { label: "Transform 2" });

      store.addEdge(startId, transform1Id);
      store.addEdge(transform2Id, transform1Id);

      expect(store.edges).toHaveLength(1);
    });

    it("should remove edge", () => {
      const store = useWorkflowStore();
      const startId = store.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      const endId = store.addNode("end", { x: 100, y: 0 }, { label: "End" });

      store.addEdge(startId, endId);
      const edgeId = store?.edges[0]?.id ?? '';

      store.removeEdge(edgeId);

      expect(store.edges).toHaveLength(0);
    });

    it("should set selected node", () => {
      const store = useWorkflowStore();
      const nodeId = store.addNode("start", { x: 0, y: 0 }, { label: "Start" });

      store.setSelectedNode(nodeId);
      expect(store.selectedNodeId).toBe(nodeId);

      store.setSelectedNode(null);
      expect(store.selectedNodeId).toBeNull();
    });

    it("should set executing state", () => {
      const store = useWorkflowStore();

      store.setExecuting(true);
      expect(store.isExecuting).toBe(true);

      store.setExecuting(false);
      expect(store.isExecuting).toBe(false);
    });

    it("should export workflow", () => {
      const store = useWorkflowStore();
      store.addNode("start", { x: 0, y: 0 }, { label: "Start" });

      const exported = store.exportWorkflow();

      expect(exported.version).toBe("1.0.0");
      expect(exported.timestamp).toBeTypeOf("number");
      expect(exported.nodes).toHaveLength(1);
      expect(exported.edges).toHaveLength(0);
    });

    it("should import workflow", () => {
      const store = useWorkflowStore();
      const importData = {
        version: "1.0.0",
        timestamp: Date.now(),
        nodes: [
          {
            id: "test-node",
            type: "start",
            position: { x: 10, y: 10 },
            data: { label: "Imported Start" },
          },
        ],
        edges: [],
      };

      store.importWorkflow(importData);

      expect(store.nodes).toHaveLength(1);
      expect(store?.nodes[0]?.id).toBe("test-node");
      expect(store.selectedNodeId).toBeNull();
      expect(store.isExecuting).toBe(false);
    });

    it("should clear workflow", () => {
      const store = useWorkflowStore();
      store.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      store.addNode("end", { x: 100, y: 0 }, { label: "End" });
      store.addEdge(store?.nodes?.[0]?.id ?? '', store?.nodes?.[1]?.id ?? '');
      store.setSelectedNode(store?.nodes?.[0]?.id ?? '');
      store.setExecuting(true);

      store.clearWorkflow();

      expect(store.nodes).toEqual([]);
      expect(store.edges).toEqual([]);
      expect(store.selectedNodeId).toBeNull();
      expect(store.isExecuting).toBe(false);
    });
  });
});
