import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useWorkflowHistory, markActionStart, markActionEnd } from "../useWorkflowHistory";
import { useWorkflowStore } from "../../stores/workflow";
import { useHistoryStore } from "../../stores/history";

describe("useWorkflowHistory", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not record during action", () => {
    const workflowStore = useWorkflowStore();
    const historyStore = useHistoryStore();

    useWorkflowHistory();

    markActionStart();

    workflowStore.addNode("start", { x: 0, y: 0 }, { label: "Start" });

    vi.advanceTimersByTime(500);

    expect(historyStore.past).toHaveLength(0);

    markActionEnd();

    expect(historyStore.past).toHaveLength(1);
  });

  it("should clear timer on action end", () => {
    const workflowStore = useWorkflowStore();
    const historyStore = useHistoryStore();

    useWorkflowHistory();

    workflowStore.addNode("start", { x: 0, y: 0 }, { label: "Start" });

    markActionEnd();

    vi.advanceTimersByTime(500);

    expect(historyStore.past).toHaveLength(1);
  });
});
