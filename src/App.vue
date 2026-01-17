<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Play, Download, Upload, Undo, Redo, Trash2 } from "lucide-vue-next";
import { useWorkflowStore } from "./stores/workflow";
import { useHistoryStore } from "./stores/history";
import { workflowEngine } from "./services/workflowEngine";
import { storageService } from "./services/storageService";
import { useKeyboardShortcuts } from "./composables/useKeyboardShortcuts";
import { useWorkflowHistory } from "./composables/useWorkflowHistory";
import { useAutosave } from "./composables/useAutosave";
import NodePalette from "./components/workflow/NodePalette.vue";
import WorkflowCanvas from "./components/workflow/WorkflowCanvas.vue";
import ConfigPanel from "./components/workflow/ConfigPanel.vue";
import ExecutionLog from "./components/workflow/ExecutionLog.vue";
import Button from "./components/ui/Button.vue";
import type { ExecutionLog as ExecutionLogType } from "./types/workflow";

const workflowStore = useWorkflowStore();
const historyStore = useHistoryStore();

useWorkflowHistory();
useAutosave();

useKeyboardShortcuts({
  onUndo: () => {
    if (historyStore.canUndo) {
      historyStore.undo();
    }
  },
  onRedo: () => {
    if (historyStore.canRedo) {
      historyStore.redo();
    }
  },
  onDelete: () => {
    if (workflowStore.selectedNodeId) {
      workflowStore.deleteNode(workflowStore.selectedNodeId);
      historyStore.recordState();
    }
  },
  onEscape: () => workflowStore.setSelectedNode(null),
});

const executionLogs = ref<ExecutionLogType[]>([]);
const errorMessage = ref<string>("");

onMounted(() => {
  const savedWorkflow = storageService.loadWorkflow();
  if (savedWorkflow) {
    workflowStore.importWorkflow(savedWorkflow);
  }
});

const runWorkflow = async () => {
  if (!workflowStore.canExecute) {
    errorMessage.value = "Workflow must have at least a Start and End node";
    setTimeout(() => (errorMessage.value = ""), 3000);
    return;
  }

  try {
    workflowStore.setExecuting(true);
    errorMessage.value = "";
    executionLogs.value = [];

    await new Promise((resolve) => setTimeout(resolve, 100));

    const logs = workflowEngine.execute(
      workflowStore.nodes,
      workflowStore.edges,
    );
    executionLogs.value = logs;
  } catch (error) {
    errorMessage.value = (error as Error).message;
    setTimeout(() => (errorMessage.value = ""), 5000);
  } finally {
    workflowStore.setExecuting(false);
  }
};

const exportWorkflow = () => {
  const workflow = workflowStore.exportWorkflow();
  const dataStr = JSON.stringify(workflow, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `workflow-${Date.now()}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

const importWorkflow = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const workflow = JSON.parse(event.target?.result as string);
        workflowStore.importWorkflow(workflow);
        historyStore.clearHistory();
        executionLogs.value = [];
        errorMessage.value = "";
      } catch {
        errorMessage.value = "Failed to import workflow: Invalid JSON";
        setTimeout(() => (errorMessage.value = ""), 3000);
      }
    };
    reader.readAsText(file);
  };

  input.click();
};

const clearWorkflow = () => {
  if (confirm("Are you sure you want to clear the entire workflow?")) {
    workflowStore.clearWorkflow();
    historyStore.clearHistory();
    executionLogs.value = [];
    errorMessage.value = "";
  }
};

const clearLogs = () => {
  executionLogs.value = [];
};

const undo = () => {
  historyStore.undo();
};

const redo = () => {
  historyStore.redo();
};
</script>

<template>
  <div class="app-container">
    <header class="bg-white border-b border-gray-200 shadow-sm">
      <div class="flex items-center justify-between px-6 py-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
            Workflow Builder
          </h1>
          <p class="text-sm text-gray-600 mt-0.5">
            Build and execute visual workflows with ease
          </p>
        </div>

        <div class="toolbar">
          <Button
            @click="undo"
            variant="secondary"
            size="sm"
            :disabled="!historyStore.canUndo"
            title="Undo (Ctrl+Z)"
          >
            <Undo :size="16" />
          </Button>

          <Button
            @click="redo"
            variant="secondary"
            size="sm"
            :disabled="!historyStore.canRedo"
            title="Redo (Ctrl+Y)"
          >
            <Redo :size="16" />
          </Button>

          <div class="divider" />

          <Button
            @click="runWorkflow"
            variant="primary"
            size="sm"
            :disabled="workflowStore.isExecuting || !workflowStore.canExecute"
            class="flex items-center gap-2 font-semibold"
          >
            <Play :size="16" />
            Run Workflow
          </Button>

          <Button
            @click="exportWorkflow"
            variant="secondary"
            size="sm"
            class="flex items-center gap-2"
            title="Export workflow"
          >
            <Download :size="16" />
            Export
          </Button>

          <Button
            @click="importWorkflow"
            variant="secondary"
            size="sm"
            class="flex items-center gap-2"
            title="Import workflow"
          >
            <Upload :size="16" />
            Import
          </Button>

          <div class="divider" />

          <Button
            @click="clearWorkflow"
            variant="danger"
            size="sm"
            class="flex items-center gap-2"
            title="Clear workflow"
          >
            <Trash2 :size="16" />
          </Button>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="mx-6 mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-start gap-3 shadow-soft"
      >
        <svg
          class="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="flex-1">
          <p class="text-sm font-semibold text-danger-800">Error</p>
          <p class="text-sm text-danger-700 mt-0.5">{{ errorMessage }}</p>
        </div>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <NodePalette />

      <WorkflowCanvas />

      <ConfigPanel />
    </div>

    <ExecutionLog :logs="executionLogs" @clear="clearLogs" />
  </div>
</template>
