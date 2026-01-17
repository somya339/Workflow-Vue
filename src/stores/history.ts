import { defineStore } from "pinia";
import type { HistoryState, WorkflowState } from "../types/workflow";
import { useWorkflowStore } from "./workflow";
import { serializeState } from "../utils/stateComparison";

let isApplyingHistory = false;

export function getIsApplyingHistory() {
  return isApplyingHistory;
}

export const useHistoryStore = defineStore("history", {
  state: (): HistoryState => ({
    past: [],
    future: [],
  }),

  getters: {
    canUndo(state): boolean {
      return state.past.length > 0;
    },

    canRedo(state): boolean {
      return state.future.length > 0;
    },
  },

  actions: {
    recordState(force = false) {
      const workflowStore = useWorkflowStore();
      const currentState: WorkflowState = {
        nodes: JSON.parse(JSON.stringify(workflowStore.nodes)),
        edges: JSON.parse(JSON.stringify(workflowStore.edges)),
        selectedNodeId: workflowStore.selectedNodeId,
        isExecuting: workflowStore.isExecuting,
      };

      if (!force && this.past.length > 0) {
        const lastState = this.past[this.past.length - 1];
        const currentSerialized = serializeState(currentState);
        const lastSerialized = serializeState(lastState!);

        if (currentSerialized === lastSerialized) {
          return;
        }
      }

      this.past.push(currentState);
      this.future = [];

      if (this.past.length > 50) {
        this.past.shift();
      }
    },

    undo() {
      if (!this.canUndo) return;

      isApplyingHistory = true;

      const workflowStore = useWorkflowStore();
      const currentState: WorkflowState = {
        nodes: JSON.parse(JSON.stringify(workflowStore.nodes)),
        edges: JSON.parse(JSON.stringify(workflowStore.edges)),
        selectedNodeId: workflowStore.selectedNodeId,
        isExecuting: workflowStore.isExecuting,
      };

      this.future.push(currentState);

      const previousState = this.past.pop()!;
      workflowStore.nodes = previousState.nodes;
      workflowStore.edges = previousState.edges;
      workflowStore.selectedNodeId = previousState.selectedNodeId;
      workflowStore.isExecuting = previousState.isExecuting;

      setTimeout(() => {
        isApplyingHistory = false;
      }, 100);
    },

    redo() {
      if (!this.canRedo) return;

      isApplyingHistory = true;

      const workflowStore = useWorkflowStore();
      const currentState: WorkflowState = {
        nodes: JSON.parse(JSON.stringify(workflowStore.nodes)),
        edges: JSON.parse(JSON.stringify(workflowStore.edges)),
        selectedNodeId: workflowStore.selectedNodeId,
        isExecuting: workflowStore.isExecuting,
      };

      this.past.push(currentState);

      const nextState = this.future.pop()!;
      workflowStore.nodes = nextState.nodes;
      workflowStore.edges = nextState.edges;
      workflowStore.selectedNodeId = nextState.selectedNodeId;
      workflowStore.isExecuting = nextState.isExecuting;

      setTimeout(() => {
        isApplyingHistory = false;
      }, 100);
    },

    clearHistory() {
      this.past = [];
      this.future = [];
    },
  },
});
