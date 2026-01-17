import { describe, it, expect } from "vitest";
import { areStatesEqual, serializeState } from "../stateComparison";
import type { WorkflowState } from "../../types/workflow";

describe("State Comparison Utils", () => {
  const createState = (
    nodes: any[] = [],
    edges: any[] = [],
    selectedNodeId: string | null = null,
    isExecuting: boolean = false
  ): WorkflowState => ({
    nodes,
    edges,
    selectedNodeId,
    isExecuting,
  });

  describe("areStatesEqual", () => {
    it("should return true for identical states", () => {
      const state1 = createState([{ id: "node1", type: "start", position: { x: 0, y: 0 }, data: {} }]);
      const state2 = createState([{ id: "node1", type: "start", position: { x: 0, y: 0 }, data: {} }]);

      expect(areStatesEqual(state1, state2)).toBe(true);
    });

    it("should return false for different node counts", () => {
      const state1 = createState([{ id: "node1", type: "start", position: { x: 0, y: 0 }, data: {} }]);
      const state2 = createState([
        { id: "node1", type: "start", position: { x: 0, y: 0 }, data: {} },
        { id: "node2", type: "end", position: { x: 100, y: 0 }, data: {} },
      ]);

      expect(areStatesEqual(state1, state2)).toBe(false);
    });

    it("should return false for different edge counts", () => {
      const state1 = createState([], [{ id: "edge1", source: "node1", target: "node2" }]);
      const state2 = createState([], [
        { id: "edge1", source: "node1", target: "node2" },
        { id: "edge2", source: "node2", target: "node3" },
      ]);

      expect(areStatesEqual(state1, state2)).toBe(false);
    });

    it("should return false for different node IDs", () => {
      const state1 = createState([{ id: "node1", type: "start", position: { x: 0, y: 0 }, data: {} }]);
      const state2 = createState([{ id: "node2", type: "start", position: { x: 0, y: 0 }, data: {} }]);

      expect(areStatesEqual(state1, state2)).toBe(false);
    });

    it("should return false for different node types", () => {
      const state1 = createState([{ id: "node1", type: "start", position: { x: 0, y: 0 }, data: {} }]);
      const state2 = createState([{ id: "node1", type: "end", position: { x: 0, y: 0 }, data: {} }]);

      expect(areStatesEqual(state1, state2)).toBe(false);
    });

    it("should return false for significantly different positions", () => {
      const state1 = createState([{ id: "node1", type: "start", position: { x: 0, y: 0 }, data: {} }]);
      const state2 = createState([{ id: "node1", type: "start", position: { x: 10, y: 0 }, data: {} }]);

      expect(areStatesEqual(state1, state2)).toBe(false);
    });

    it("should return true for slightly different positions (within tolerance)", () => {
      const state1 = createState([{ id: "node1", type: "start", position: { x: 0, y: 0 }, data: {} }]);
      const state2 = createState([{ id: "node1", type: "start", position: { x: 0.5, y: 0.8 }, data: {} }]);

      expect(areStatesEqual(state1, state2)).toBe(true);
    });

    it("should return false for different node data", () => {
      const state1 = createState([{ id: "node1", type: "start", position: { x: 0, y: 0 }, data: { label: "Start" } }]);
      const state2 = createState([{ id: "node1", type: "start", position: { x: 0, y: 0 }, data: { label: "End" } }]);

      expect(areStatesEqual(state1, state2)).toBe(false);
    });

    it("should return false for different edge IDs", () => {
      const state1 = createState([], [{ id: "edge1", source: "node1", target: "node2" }]);
      const state2 = createState([], [{ id: "edge2", source: "node1", target: "node2" }]);

      expect(areStatesEqual(state1, state2)).toBe(false);
    });

    it("should return false for different edge sources", () => {
      const state1 = createState([], [{ id: "edge1", source: "node1", target: "node2" }]);
      const state2 = createState([], [{ id: "edge1", source: "node3", target: "node2" }]);

      expect(areStatesEqual(state1, state2)).toBe(false);
    });

    it("should return false for different edge targets", () => {
      const state1 = createState([], [{ id: "edge1", source: "node1", target: "node2" }]);
      const state2 = createState([], [{ id: "edge1", source: "node1", target: "node3" }]);

      expect(areStatesEqual(state1, state2)).toBe(false);
    });

    it("should handle empty states", () => {
      const state1 = createState();
      const state2 = createState();

      expect(areStatesEqual(state1, state2)).toBe(true);
    });

    it("should handle null/undefined nodes gracefully", () => {
      const state1 = createState([null as any, undefined as any]);
      const state2 = createState([null as any, undefined as any]);

      expect(areStatesEqual(state1, state2)).toBe(true);
    });
  });

  describe("serializeState", () => {
    it("should serialize state to JSON string", () => {
      const state = createState(
        [{ id: "node1", type: "start", position: { x: 10.7, y: 20.3 }, data: { label: "Start" } }],
        [{ id: "edge1", source: "node1", target: "node2" }],
        "node1",
        false
      );

      const serialized = serializeState(state);
      const parsed = JSON.parse(serialized);

      expect(parsed.nodes).toHaveLength(1);
      expect(parsed.nodes[0].position.x).toBe(11); // rounded
      expect(parsed.nodes[0].position.y).toBe(20); // rounded
      expect(parsed.edges).toHaveLength(1);
      expect(parsed.edges[0].source).toBe("node1");
    });

    it("should round position values", () => {
      const state = createState([
        { id: "node1", type: "start", position: { x: 10.9, y: 20.6 }, data: {} },
      ]);

      const serialized = serializeState(state);
      const parsed = JSON.parse(serialized);

      expect(parsed.nodes[0].position.x).toBe(11);
      expect(parsed.nodes[0].position.y).toBe(21);
    });

    it("should include all necessary fields", () => {
      const state = createState(
        [{ id: "node1", type: "start", position: { x: 0, y: 0 }, data: { label: "Test" } }],
        [{ id: "edge1", source: "node1", target: "node2" }]
      );

      const serialized = serializeState(state);
      const parsed = JSON.parse(serialized);

      expect(parsed.nodes[0]).toHaveProperty("id", "node1");
      expect(parsed.nodes[0]).toHaveProperty("type", "start");
      expect(parsed.nodes[0]).toHaveProperty("position");
      expect(parsed.nodes[0]).toHaveProperty("data");
      expect(parsed.edges[0]).toHaveProperty("id", "edge1");
      expect(parsed.edges[0]).toHaveProperty("source", "node1");
      expect(parsed.edges[0]).toHaveProperty("target", "node2");
    });

    it("should handle empty state", () => {
      const state = createState();

      const serialized = serializeState(state);
      const parsed = JSON.parse(serialized);

      expect(parsed.nodes).toEqual([]);
      expect(parsed.edges).toEqual([]);
    });
  });
});
