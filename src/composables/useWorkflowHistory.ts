import { watch } from "vue";
import { useWorkflowStore } from "../stores/workflow";
import { useHistoryStore } from "../stores/history";

let debounceTimer: number | null = null;
let actionInProgress = false;

export function useWorkflowHistory() {
  const workflowStore = useWorkflowStore();
  const historyStore = useHistoryStore();

  watch(
    () => workflowStore.nodes.length,
    (newLength, oldLength) => {
      if (newLength !== oldLength) {
        scheduleRecording();
      }
    }
  );

  watch(
    () => workflowStore.edges.length,
    (newLength, oldLength) => {
      if (newLength !== oldLength) {
        scheduleRecording();
      }
    }
  );

  watch(
    () => workflowStore.nodes.map((n) => JSON.stringify(n.data)).join("|"),
    () => {
      scheduleRecording();
    }
  );

  function scheduleRecording() {
    if (actionInProgress) return;

    if (debounceTimer !== null) {
      clearTimeout(debounceTimer);
    }

    debounceTimer = globalThis.setTimeout(() => {
      historyStore.recordState();
      debounceTimer = null;
    }, 500);
  }
}

export function markActionStart() {
  actionInProgress = true;
}

export function markActionEnd() {
  actionInProgress = false;
  const historyStore = useHistoryStore();
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  historyStore.recordState();
}
