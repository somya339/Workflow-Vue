import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useHistoryStore } from "../history";
import { useWorkflowStore } from "../workflow";
import { getIsApplyingHistory } from "../history";

describe("History Store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      const store = useHistoryStore();
      expect(store.past).toEqual([]);
      expect(store.future).toEqual([]);
    });
  });

  describe("Getters", () => {
    it("should determine if undo is available", () => {
      const store = useHistoryStore();
      expect(store.canUndo).toBe(false);

      store.recordState();
      expect(store.canUndo).toBe(true);
    });

    it("should determine if redo is available", () => {
      const store = useHistoryStore();
      expect(store.canRedo).toBe(false);

      store.recordState();
      store.undo();
      expect(store.canRedo).toBe(true);
    });
  });

  describe("Actions", () => {
    it("should record state", () => {
      const historyStore = useHistoryStore();
      const workflowStore = useWorkflowStore();

      workflowStore.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      historyStore.recordState();

      expect(historyStore.past).toHaveLength(1);
      expect(historyStore.past[0]!.nodes).toHaveLength(1);
    });

    it("should not record duplicate states", () => {
      const historyStore = useHistoryStore();
      const workflowStore = useWorkflowStore();

      workflowStore.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      historyStore.recordState();
      historyStore.recordState();

      expect(historyStore.past).toHaveLength(1);
    });

    it("should force record duplicate states", () => {
      const historyStore = useHistoryStore();
      const workflowStore = useWorkflowStore();

      workflowStore.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      historyStore.recordState();
      historyStore.recordState(true);

      expect(historyStore.past).toHaveLength(2);
    });

    it("should limit history to 50 states", () => {
      const historyStore = useHistoryStore();
      const workflowStore = useWorkflowStore();

      for (let i = 0; i < 55; i++) {
        workflowStore.addNode("start", { x: i, y: i }, { label: `Start ${i}` });
        historyStore.recordState(true);
      }

      expect(historyStore.past).toHaveLength(50);
    });

    it("should not undo when no past states", () => {
      const historyStore = useHistoryStore();
      const workflowStore = useWorkflowStore();

      workflowStore.addNode("start", { x: 0, y: 0 }, { label: "Start" });

      historyStore.undo();

      expect(workflowStore.nodes).toHaveLength(1);
    });

    it("should not redo when no future states", () => {
      const historyStore = useHistoryStore();
      const workflowStore = useWorkflowStore();

      workflowStore.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      historyStore.recordState();

      historyStore.redo();

      expect(workflowStore.nodes).toHaveLength(1);
    });

    it("should set isApplyingHistory flag during redo", () => {
      const historyStore = useHistoryStore();
      const workflowStore = useWorkflowStore();

      workflowStore.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      historyStore.recordState();

      workflowStore.addNode("end", { x: 100, y: 0 }, { label: "End" });
      historyStore.recordState();

      historyStore.undo();
      historyStore.redo();
      expect(getIsApplyingHistory()).toBe(true);

      vi.advanceTimersByTime(100);
      expect(getIsApplyingHistory()).toBe(false);
    });

    it("should clear history", () => {
      const historyStore = useHistoryStore();
      const workflowStore = useWorkflowStore();

      workflowStore.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      historyStore.recordState();

      workflowStore.addNode("end", { x: 100, y: 0 }, { label: "End" });
      historyStore.recordState();

      historyStore.undo();

      expect(historyStore.past).toHaveLength(1);
      expect(historyStore.future).toHaveLength(1);

      historyStore.clearHistory();

      expect(historyStore.past).toEqual([]);
      expect(historyStore.future).toEqual([]);
    });

    it("should clear future when recording new state", () => {
      const historyStore = useHistoryStore();
      const workflowStore = useWorkflowStore();

      workflowStore.addNode("start", { x: 0, y: 0 }, { label: "Start" });
      historyStore.recordState();

      workflowStore.addNode("end", { x: 100, y: 0 }, { label: "End" });
      historyStore.recordState();

      historyStore.undo();
      expect(historyStore.future).toHaveLength(1);

      workflowStore.addNode("transform", { x: 50, y: 0 }, { label: "Transform" });
      historyStore.recordState();

      expect(historyStore.future).toHaveLength(0);
    });
  });
});
