<script setup lang="ts">
import { Play, Repeat, CheckCircle } from "lucide-vue-next";
import type { NodeTemplate } from "../../types/nodes";

const nodeTemplates: NodeTemplate[] = [
  {
    type: "start",
    label: "Start Node",
    description: "Begin workflow with initial data",
    icon: "play",
  },
  {
    type: "transform",
    label: "Transform Node",
    description: "Transform data with operations",
    icon: "repeat",
  },
  {
    type: "end",
    label: "End Node",
    description: "Complete workflow and display result",
    icon: "check",
  },
];

const onDragStart = (event: DragEvent, nodeType: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData("application/vueflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  }
};
</script>

<template>
  <div
    class="w-72 bg-white border-r border-gray-200 flex flex-col overflow-hidden"
  >
    <div class="panel-header">
      <h2 class="panel-title">Node Palette</h2>
      <p class="text-xs text-gray-500 mt-0.5">Drag nodes to canvas</p>
    </div>

    <div class="panel-content space-y-3 overflow-y-auto flex-1">
      <div
        v-for="template in nodeTemplates"
        :key="template.type"
        draggable="true"
        @dragstart="onDragStart($event, template.type)"
        class="node-card p-3.5 cursor-move border-l-4 hover:border-primary-400 active:scale-95 transition-all"
        :class="{
          'border-l-success-500 hover:border-l-success-600':
            template.type === 'start',
          'border-l-primary-500 hover:border-l-primary-600':
            template.type === 'transform',
          'border-l-danger-500 hover:border-l-danger-600':
            template.type === 'end',
        }"
      >
        <div class="flex items-start gap-3">
          <div
            class="flex items-center justify-center w-11 h-11 rounded-lg flex-shrink-0"
            :class="{
              'bg-gradient-to-br from-success-100 to-success-200':
                template.type === 'start',
              'bg-gradient-to-br from-primary-100 to-primary-200':
                template.type === 'transform',
              'bg-gradient-to-br from-danger-100 to-danger-200':
                template.type === 'end',
            }"
          >
            <Play
              v-if="template.type === 'start'"
              :size="22"
              class="text-success-600"
            />
            <Repeat
              v-if="template.type === 'transform'"
              :size="22"
              class="text-primary-600"
            />
            <CheckCircle
              v-if="template.type === 'end'"
              :size="22"
              class="text-danger-600"
            />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-semibold text-gray-900 mb-1 leading-tight">
              {{ template.label }}
            </h3>
            <p class="text-xs text-gray-600 leading-relaxed">
              {{ template.description }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="mt-4 p-4 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-lg"
      >
        <div class="flex items-start gap-2">
          <svg
            class="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          <p class="text-xs text-primary-800 leading-relaxed">
            Drag nodes onto the canvas to build your workflow. Connect them by
            dragging from one handle to another.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
