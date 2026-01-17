<script setup lang="ts">
import { computed } from "vue";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { Controls } from "@vue-flow/controls";
import { useWorkflowStore } from "../../stores/workflow";
import { useHistoryStore } from "../../stores/history";
import { createNodeData } from "../../services/nodeFactory";
import {
  markActionStart,
  markActionEnd,
} from "../../composables/useWorkflowHistory";
import StartNode from "../nodes/StartNode.vue";
import TransformNode from "../nodes/TransformNode.vue";
import EndNode from "../nodes/EndNode.vue";
import type { NodeType } from "../../types/nodes";

const workflowStore = useWorkflowStore();
const historyStore = useHistoryStore();
const { onConnect, onNodeDragStart, onNodeDragStop, project, vueFlowRef } =
  useVueFlow();

const nodes = computed(() => workflowStore.nodes);
const edges = computed(() => workflowStore.edges);

const nodeTypes = {
  start: StartNode,
  transform: TransformNode,
  end: EndNode,
};

onNodeDragStart(() => {
  markActionStart();
});

onConnect((params) => {
  if (params.source && params.target) {
    workflowStore.addEdge(params.source, params.target);
    historyStore.recordState();
  }
});

onNodeDragStop((event) => {
  event.nodes.forEach((node) => {
    workflowStore.updateNodePosition(node.id, node.position);
  });
  markActionEnd();
});

const onNodeClick = (event: any) => {
  workflowStore.setSelectedNode(event.node.id);
};

const onPaneClick = () => {
  workflowStore.setSelectedNode(null);
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
};

const onDrop = (event: DragEvent) => {
  const type = event.dataTransfer?.getData("application/vueflow") as NodeType;
  if (!type) return;

  const bounds = vueFlowRef.value?.getBoundingClientRect();
  if (!bounds) return;

  const position = project({
    x: event.clientX - bounds.left,
    y: event.clientY - bounds.top,
  });

  const nodeData = createNodeData(type);
  const nodeId = workflowStore.addNode(type, position, nodeData);
  
  workflowStore.setSelectedNode(nodeId);
  historyStore.recordState();
};
</script>

<template>
  <div class="flex-1 relative bg-gradient-to-br from-gray-50 to-gray-100">
    <VueFlow
      :nodes="nodes"
      :edges="edges"
      :node-types="nodeTypes as any"
      @node-click="onNodeClick"
      @pane-click="onPaneClick"
      @dragover="onDragOver"
      @drop="onDrop"
      fit-view-on-init
      class="workflow-canvas"
    >
      <Background pattern-color="#d1d5db" :gap="20" :size="1.5" />
      <Controls position="bottom-left" />
    </VueFlow>

    <div
      class="absolute top-4 right-4 bg-white rounded-lg shadow-medium border border-gray-200 px-4 py-2.5"
    >
      <div class="flex items-center gap-4 text-xs">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-green-600"></div>
          <span class="text-gray-700 font-medium">Start</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-blue-600"></div>
          <span class="text-gray-700 font-medium">Transform</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-red-600"></div>
          <span class="text-gray-700 font-medium">End</span>
        </div>
      </div>
    </div>

    <div
      v-if="nodes.length === 0"
      class="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <div class="text-center max-w-md">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-medium mb-4"
        >
          <svg
            class="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
            />
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Start Building</h3>
        <p class="text-sm text-gray-600">
          Drag nodes from the left palette onto the canvas to create your
          workflow
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.workflow-canvas {
  width: 100%;
  height: 100%;
}
</style>
