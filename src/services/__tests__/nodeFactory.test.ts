import { describe, it, expect } from "vitest";
import { createNodeData, getNodeDefaults } from "../nodeFactory";
import type { NodeType, StartNodeData, TransformNodeData, EndNodeData } from "../../types/nodes";

describe("Node Factory", () => {
  describe("createNodeData", () => {
    it("should create start node data", () => {
      const data = createNodeData("start") as StartNodeData;

      expect(data.label).toBe("Start");
      expect(data.payload).toBe('{"message": "hello"}');
    });

    it("should create transform node data", () => {
      const data = createNodeData("transform") as TransformNodeData;

      expect(data.label).toBe("Transform");
      expect(data.operation).toBe("uppercase");
      expect(data.value).toBeUndefined();
    });

    it("should create end node data", () => {
      const data = createNodeData("end") as EndNodeData;

      expect(data.label).toBe("End");
      expect(data.receivedPayload).toBeNull();
    });

    it("should throw error for unknown node type", () => {
      expect(() => createNodeData("unknown" as NodeType)).toThrow(
        "Unknown node type: unknown"
      );
    });
  });

  describe("getNodeDefaults", () => {
    it("should return defaults for start node", () => {
      const defaults = getNodeDefaults("start");
      const data = defaults.data as StartNodeData;

      expect(defaults.type).toBe("start");
      expect(data.label).toBe("Start");
      expect(data.payload).toBe('{"message": "hello"}');
    });

    it("should return defaults for transform node", () => {
      const defaults = getNodeDefaults("transform");
      const data = defaults.data as TransformNodeData;

      expect(defaults.type).toBe("transform");
      expect(data.label).toBe("Transform");
      expect(data.operation).toBe("uppercase");
    });

    it("should return defaults for end node", () => {
      const defaults = getNodeDefaults("end");
      const data = defaults.data as EndNodeData;

      expect(defaults.type).toBe("end");
      expect(data.label).toBe("End");
      expect(data.receivedPayload).toBeNull();
    });
  });
});
