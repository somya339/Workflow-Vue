import { describe, it, expect, beforeEach } from "vitest";
import { WorkflowEngine } from "../workflowEngine";
import type { WorkflowNode, WorkflowEdge } from "../../types/workflow";

describe("WorkflowEngine", () => {
  let engine: WorkflowEngine;

  beforeEach(() => {
    engine = new WorkflowEngine();
  });

  describe("Basic Execution", () => {
    it("should throw error when no nodes provided", () => {
      expect(() => engine.execute([], [])).toThrow(
        "Cannot execute workflow: No nodes found"
      );
    });

    it("should throw error when no start node", () => {
      const nodes: WorkflowNode[] = [
        {
          id: "end-1",
          type: "end",
          position: { x: 100, y: 0 },
          data: { label: "End" },
        },
      ];

      expect(() => engine.execute(nodes, [])).toThrow(
        "Cannot execute workflow: No start node found"
      );
    });

    it("should throw error when no end node", () => {
      const nodes: WorkflowNode[] = [
        {
          id: "start-1",
          type: "start",
          position: { x: 0, y: 0 },
          data: { label: "Start", payload: '{"message": "hello"}' },
        },
      ];

      expect(() => engine.execute(nodes, [])).toThrow(
        "Cannot execute workflow: No end node found"
      );
    });

    it("should execute simple start-end workflow", () => {
      const nodes: WorkflowNode[] = [
        {
          id: "start-1",
          type: "start",
          position: { x: 0, y: 0 },
          data: { label: "Start", payload: '{"message": "hello"}' },
        },
        {
          id: "end-1",
          type: "end",
          position: { x: 100, y: 0 },
          data: { label: "End" },
        },
      ];

      const edges: WorkflowEdge[] = [
        { id: "e-start-1-end-1", source: "start-1", target: "end-1" },
      ];

      const logs = engine.execute(nodes, edges);

      expect(logs).toHaveLength(2);
      expect(logs?.[0]?.nodeType).toBe("start");
      expect(logs?.[0]?.output).toEqual({ message: "hello" });
      expect(logs?.[1]?.nodeType).toBe("end");
      expect(logs?.[1]?.input).toEqual({ message: "hello" });
    });
  });

  describe("Transform Operations", () => {
    it("should execute uppercase transformation", () => {
      const nodes: WorkflowNode[] = [
        {
          id: "start-1",
          type: "start",
          position: { x: 0, y: 0 },
          data: { label: "Start", payload: '"hello world"' },
        },
        {
          id: "transform-1",
          type: "transform",
          position: { x: 100, y: 0 },
          data: { label: "Transform", operation: "uppercase" },
        },
        {
          id: "end-1",
          type: "end",
          position: { x: 200, y: 0 },
          data: { label: "End" },
        },
      ];

      const edges: WorkflowEdge[] = [
        { id: "e-start-1-transform-1", source: "start-1", target: "transform-1" },
        { id: "e-transform-1-end-1", source: "transform-1", target: "end-1" },
      ];

      const logs = engine.execute(nodes, edges);

      expect(logs).toHaveLength(3);
      expect(logs?.[1]?.output).toBe("HELLO WORLD");
      expect(logs?.[2]?.input).toBe("HELLO WORLD");
    });

    it("should execute lowercase transformation", () => {
      const nodes: WorkflowNode[] = [
        {
          id: "start-1",
          type: "start",
          position: { x: 0, y: 0 },
          data: { label: "Start", payload: '"HELLO WORLD"' },
        },
        {
          id: "transform-1",
          type: "transform",
          position: { x: 100, y: 0 },
          data: { label: "Transform", operation: "lowercase" },
        },
        {
          id: "end-1",
          type: "end",
          position: { x: 200, y: 0 },
          data: { label: "End" },
        },
      ];

      const edges: WorkflowEdge[] = [
        { id: "e-start-1-transform-1", source: "start-1", target: "transform-1" },
        { id: "e-transform-1-end-1", source: "transform-1", target: "end-1" },
      ];

      const logs = engine.execute(nodes, edges);

      expect(logs).toHaveLength(3);
      expect(logs?.[1]?.output).toBe("hello world");
    });

    it("should execute append transformation", () => {
      const nodes: WorkflowNode[] = [
        {
          id: "start-1",
          type: "start",
          position: { x: 0, y: 0 },
          data: { label: "Start", payload: '"hello"' },
        },
        {
          id: "transform-1",
          type: "transform",
          position: { x: 100, y: 0 },
          data: { label: "Transform", operation: "append", value: " world" },
        },
        {
          id: "end-1",
          type: "end",
          position: { x: 200, y: 0 },
          data: { label: "End" },
        },
      ];

      const edges: WorkflowEdge[] = [
        { id: "e-start-1-transform-1", source: "start-1", target: "transform-1" },
        { id: "e-transform-1-end-1", source: "transform-1", target: "end-1" },
      ];

      const logs = engine.execute(nodes, edges);

      expect(logs).toHaveLength(3);
      expect(logs?.[1]?.output).toBe("hello world");
    });

    it("should execute multiply transformation", () => {
      const nodes: WorkflowNode[] = [
        {
          id: "start-1",
          type: "start",
          position: { x: 0, y: 0 },
          data: { label: "Start", payload: "5" },
        },
        {
          id: "transform-1",
          type: "transform",
          position: { x: 100, y: 0 },
          data: { label: "Transform", operation: "multiply", value: "3" },
        },
        {
          id: "end-1",
          type: "end",
          position: { x: 200, y: 0 },
          data: { label: "End" },
        },
      ];

      const edges: WorkflowEdge[] = [
        { id: "e-start-1-transform-1", source: "start-1", target: "transform-1" },
        { id: "e-transform-1-end-1", source: "transform-1", target: "end-1" },
      ];

      const logs = engine.execute(nodes, edges);

      expect(logs).toHaveLength(3);
      expect(logs?.[1]?.output).toBe(15);
    });

    it("should handle object transformations", () => {
      const nodes: WorkflowNode[] = [
        {
          id: "start-1",
          type: "start",
          position: { x: 0, y: 0 },
          data: { label: "Start", payload: '{"name": "john", "age": 25}' },
        },
        {
          id: "transform-1",
          type: "transform",
          position: { x: 100, y: 0 },
          data: { label: "Transform", operation: "uppercase" },
        },
        {
          id: "end-1",
          type: "end",
          position: { x: 200, y: 0 },
          data: { label: "End" },
        },
      ];

      const edges: WorkflowEdge[] = [
        { id: "e-start-1-transform-1", source: "start-1", target: "transform-1" },
        { id: "e-transform-1-end-1", source: "transform-1", target: "end-1" },
      ];

      const logs = engine.execute(nodes, edges);

      expect(logs).toHaveLength(3);
      expect(logs?.[1]?.output).toEqual({ name: "JOHN", age: 25 });
    });
  });

  describe("Complex Workflows", () => {
    it("should execute workflow with multiple transforms", () => {
      const nodes: WorkflowNode[] = [
        {
          id: "start-1",
          type: "start",
          position: { x: 0, y: 0 },
          data: { label: "Start", payload: '"hello"' },
        },
        {
          id: "transform-1",
          type: "transform",
          position: { x: 100, y: 0 },
          data: { label: "Transform 1", operation: "uppercase" },
        },
        {
          id: "transform-2",
          type: "transform",
          position: { x: 200, y: 0 },
          data: { label: "Transform 2", operation: "append", value: " WORLD" },
        },
        {
          id: "end-1",
          type: "end",
          position: { x: 300, y: 0 },
          data: { label: "End" },
        },
      ];

      const edges: WorkflowEdge[] = [
        { id: "e-start-1-transform-1", source: "start-1", target: "transform-1" },
        { id: "e-transform-1-transform-2", source: "transform-1", target: "transform-2" },
        { id: "e-transform-2-end-1", source: "transform-2", target: "end-1" },
      ];

      const logs = engine.execute(nodes, edges);

      expect(logs).toHaveLength(4);
      expect(logs?.[1]?.output).toBe("HELLO");
      expect(logs?.[2]?.output).toBe("HELLO WORLD");
      expect(logs?.[3]?.input).toBe("HELLO WORLD");
    });
  });
});
