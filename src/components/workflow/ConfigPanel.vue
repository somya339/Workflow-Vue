<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { X, Trash2 } from "lucide-vue-next";
import { useWorkflowStore } from "../../stores/workflow";
import { useHistoryStore } from "../../stores/history";
import Button from "../ui/Button.vue";
import Input from "../ui/Input.vue";

const workflowStore = useWorkflowStore();
const historyStore = useHistoryStore();

const selectedNode = computed(() => workflowStore.selectedNode);

const formData = ref<any>({});

watch(
  selectedNode,
  (node) => {
    if (node) {
      formData.value = { ...node.data };
      if (node.type === "transform" && formData.value.value === undefined) {
        formData.value.value = "";
      }
    } else {
      formData.value = {};
    }
  },
  { immediate: true }
);

watch(
  () => formData.value.operation,
  (newOp, oldOp) => {
    if (newOp !== oldOp && (newOp === "append" || newOp === "multiply")) {
      if (formData.value.value === undefined || formData.value.value === null) {
        formData.value.value = newOp === "multiply" ? 2 : "";
      }
    }
  }
);

const saveConfig = () => {
  if (selectedNode.value) {
    const dataToSave = { ...formData.value };

    if (
      selectedNode.value.type === "transform" &&
      formData.value.operation === "multiply"
    ) {
      if (formData.value.value !== undefined && formData.value.value !== "") {
        dataToSave.value = Number(formData.value.value);
      }
    }

    workflowStore.updateNode(selectedNode.value.id, dataToSave);
    historyStore.recordState();
  }
};

const deleteNode = () => {
  if (selectedNode.value) {
    workflowStore.deleteNode(selectedNode.value.id);
    historyStore.recordState();
  }
};

const closePanel = () => {
  workflowStore.setSelectedNode(null);
};
</script>

<template>
  <div
    v-if="selectedNode"
    class="w-80 bg-white border-l border-gray-200 overflow-y-auto flex flex-col"
  >
    <div class="panel-header flex items-center justify-between">
      <div>
        <h2 class="panel-title">Configure Node</h2>
        <p class="text-xs text-gray-500 mt-0.5">Edit node settings</p>
      </div>
      <button
        @click="closePanel"
        class="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
        title="Close (Esc)"
      >
        <X :size="18" class="text-gray-600" />
      </button>
    </div>

    <div class="flex-1 panel-content">
      <div class="mb-5">
        <div
          class="badge text-xs font-bold uppercase tracking-wider"
          :class="{
            'bg-green-100 text-green-700': selectedNode.type === 'start',
            'bg-blue-100 text-blue-700': selectedNode.type === 'transform',
            'bg-red-100 text-red-700': selectedNode.type === 'end',
          }"
        >
          {{ selectedNode.type }} Node
        </div>
      </div>

      <div class="space-y-5">
        <div class="form-group">
          <label class="form-label"> Node Label </label>
          <Input v-model="formData.label" placeholder="Enter node label" />
          <p class="text-2xs text-gray-500 mt-1">Display name for this node</p>
        </div>

        <div v-if="selectedNode.type === 'start'" class="form-group">
          <label class="form-label"> Initial Payload (JSON) </label>
          <textarea
            v-model="formData.payload"
            rows="8"
            class="w-full px-3 py-2.5 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            placeholder='{"message": "hello"}'
          />
          <p class="text-2xs text-gray-500 mt-1">
            JSON data to start the workflow
          </p>
        </div>

        <div v-if="selectedNode.type === 'transform'">
          <div class="form-group">
            <label class="form-label"> Transform Operation </label>
            <select
              v-model="formData.operation"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-sm font-medium"
            >
              <option value="uppercase">Uppercase</option>
              <option value="lowercase">Lowercase</option>
              <option value="append">Append Text</option>
              <option value="multiply">Multiply Number</option>
            </select>
            <p class="text-2xs text-gray-500 mt-1">
              Choose how to transform the data
            </p>
          </div>

          <div
            v-if="
              formData.operation === 'append' ||
              formData.operation === 'multiply'
            "
            class="form-group mt-4"
          >
            <label class="form-label">
              {{
                formData.operation === "append"
                  ? "Text to Append"
                  : "Multiplier"
              }}
            </label>
            <Input
              v-model="formData.value"
              :type="formData.operation === 'multiply' ? 'number' : 'text'"
              :placeholder="
                formData.operation === 'append' ? 'Enter text...' : '2'
              "
            />
          </div>
        </div>

        <div v-if="selectedNode.type === 'end'" class="form-group">
          <label class="form-label"> Received Payload </label>
          <div
            class="p-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-xs text-gray-700 max-h-48 overflow-auto"
          >
            {{
              formData.receivedPayload
                ? JSON.stringify(formData.receivedPayload, null, 2)
                : "No data received yet. Run the workflow to see results."
            }}
          </div>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-gray-200 bg-gray-50 space-y-2.5">
      <Button
        @click="saveConfig"
        variant="primary"
        class="w-full font-semibold"
      >
        Save Configuration
      </Button>
      <Button
        @click="deleteNode"
        variant="danger"
        class="w-full flex items-center justify-center gap-2 font-semibold"
      >
        <Trash2 :size="16" />
        Delete Node
      </Button>
    </div>
  </div>
</template>
