import type {
  WorkflowNode,
  WorkflowEdge,
  ExecutionLog,
} from "../types/workflow";
import type {
  StartNodeData,
  TransformNodeData,
  TransformOperation,
} from "../types/nodes";

export class WorkflowEngine {
  private logs: ExecutionLog[] = [];

  execute(nodes: WorkflowNode[], edges: WorkflowEdge[]): ExecutionLog[] {
    this.logs = [];

    if (nodes.length === 0) {
      throw new Error("Cannot execute workflow: No nodes found");
    }

    const startNode = nodes.find((node) => node.type === "start");
    if (!startNode) {
      throw new Error(
        "Cannot execute workflow: No start node found. Add a start node to begin execution."
      );
    }

    const endNodes = nodes.filter((node) => node.type === "end");
    if (endNodes.length === 0) {
      throw new Error(
        "Cannot execute workflow: No end node found. Add an end node to complete execution."
      );
    }

    try {
      const visited = new Set<string>();
      this.executeNode(startNode, null, nodes, edges, visited);
      return this.logs;
    } catch (error) {
      const errorMessage = (error as Error).message;
      const lastLog = this.logs[this.logs.length - 1];
      if (lastLog) {
        throw new Error(
          `Execution failed at node "${lastLog.nodeLabel}" (${lastLog.nodeType}): ${errorMessage}`
        );
      }
      throw new Error(`Execution failed: ${errorMessage}`);
    }
  }

  private executeNode(
    node: WorkflowNode,
    input: any,
    nodes: WorkflowNode[],
    edges: WorkflowEdge[],
    visited: Set<string>
  ): any {
    if (visited.has(node.id)) {
      throw new Error(
        `Circular dependency detected: Node "${node.data.label}" (${node.id}) has already been executed`
      );
    }
    visited.add(node.id);

    let output: any;

    try {
      switch (node.type) {
        case "start":
          output = this.executeStartNode(node);
          break;
        case "transform":
          output = this.executeTransformNode(node, input);
          break;
        case "end":
          output = this.executeEndNode(node, input);
          break;
        default:
          throw new Error(`Unknown node type: ${node.type}`);
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      throw new Error(
        `Error executing node "${node.data.label}" (${node.type}): ${errorMessage}`
      );
    }

    this.logs.push({
      nodeId: node.id,
      nodeLabel: node.data.label,
      nodeType: node.type,
      input,
      output,
      timestamp: Date.now(),
    });

    const nextEdges = edges.filter((edge) => edge.source === node.id);
    for (const edge of nextEdges) {
      const nextNode = nodes.find((n) => n.id === edge.target);
      if (!nextNode) {
        throw new Error(
          `Node connection error: Target node "${edge.target}" not found`
        );
      }
      this.executeNode(nextNode, output, nodes, edges, visited);
    }

    return output;
  }

  private executeStartNode(node: WorkflowNode): any {
    const data = node.data as StartNodeData;
    try {
      return JSON.parse(data.payload);
    } catch {
      throw new Error("Invalid JSON in start node payload");
    }
  }

  private executeTransformNode(node: WorkflowNode, input: any): any {
    const data = node.data as TransformNodeData;

    if (input === null || input === undefined) {
      throw new Error("Transform node requires input from previous node");
    }

    try {
      return this.applyTransformation(input, data.operation, data.value);
    } catch (error) {
      throw new Error(
        `Transform operation "${data.operation}" failed: ${(error as Error).message}`
      );
    }
  }

  private applyTransformation(
    input: any,
    operation: TransformOperation,
    value?: string | number
  ): any {
    switch (operation) {
      case "uppercase":
        return this.applyUppercase(input);
      case "lowercase":
        return this.applyLowercase(input);
      case "append":
        return this.applyAppend(input, value);
      case "multiply":
        return this.applyMultiply(input, value);
      default:
        throw new Error(`Unknown transformation operation: ${operation}`);
    }
  }

  private applyUppercase(input: any): any {
    if (typeof input === "string") {
      return input.toUpperCase();
    }
    if (typeof input === "object" && input !== null) {
      const result: any = {};
      for (const [key, val] of Object.entries(input)) {
        result[key] = typeof val === "string" ? val.toUpperCase() : val;
      }
      return result;
    }
    return input;
  }

  private applyLowercase(input: any): any {
    if (typeof input === "string") {
      return input.toLowerCase();
    }
    if (typeof input === "object" && input !== null) {
      const result: any = {};
      for (const [key, val] of Object.entries(input)) {
        result[key] = typeof val === "string" ? val.toLowerCase() : val;
      }
      return result;
    }
    return input;
  }

  private applyAppend(input: any, value: string | number = ""): any {
    if (typeof input === "string") {
      return input + String(value);
    }
    if (typeof input === "object" && input !== null) {
      const result: any = {};
      for (const [key, val] of Object.entries(input)) {
        result[key] = typeof val === "string" ? val + String(value) : val;
      }
      return result;
    }
    return input;
  }

  private applyMultiply(input: any, value?: string | number): any {
    if (value === undefined || value === null || value === "") {
      throw new Error("Multiply operation requires a multiplier value");
    }

    const multiplier = this.parseMultiplier(value);

    if (typeof input === "string") {
      throw new TypeError(
        "Cannot multiply strings. Multiply operation only works with numbers."
      );
    }

    if (typeof input === "number") {
      return input * multiplier;
    }

    if (typeof input === "object" && input !== null) {
      const result: any = {};
      for (const [key, val] of Object.entries(input)) {
        if (typeof val === "string") {
          throw new TypeError(
            `Cannot multiply string value at key "${key}". Multiply operation only works with numbers.`
          );
        }
        result[key] = typeof val === "number" ? val * multiplier : val;
      }
      return result;
    }

    throw new TypeError(
      `Cannot multiply input of type "${typeof input}". Multiply operation only works with numbers.`
    );
  }

  private parseMultiplier(value: string | number): number {
    if (typeof value === "number") {
      return value;
    }
    if (typeof value === "string") {
      const parsed = Number.parseFloat(value);
      if (Number.isNaN(parsed)) {
        throw new TypeError(
          `Invalid multiplier value: "${value}". Expected a number.`
        );
      }
      return parsed;
    }
    throw new TypeError("Multiplier must be a number or numeric string");
  }

  private executeEndNode(_node: WorkflowNode, input: any): any {
    return input;
  }
}

export const workflowEngine = new WorkflowEngine();
