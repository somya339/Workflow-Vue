import { watch, ref } from "vue";
import { useWorkflowStore } from "../stores/workflow";
import { storageService } from "../services/storageService";

export function useAutosave() {
  const workflowStore = useWorkflowStore();
  const lastSaved = ref<Date | null>(null);

  watch(
    () => [workflowStore.nodes, workflowStore.edges],
    () => {
      const workflow = workflowStore.exportWorkflow();
      storageService.autoSave(workflow);
      lastSaved.value = new Date();
    },
    { deep: true },
  );

  return {
    lastSaved,
  };
}
