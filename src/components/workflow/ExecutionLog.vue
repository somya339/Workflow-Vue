<script setup lang="ts">
import { ref } from "vue";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-vue-next";
import type { ExecutionLog } from "../../types/workflow";

interface Props {
  logs: ExecutionLog[];
}

defineProps<Props>();

const emit = defineEmits<{
  (e: "clear"): void;
}>();

const isExpanded = ref(true);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const formatTimestamp = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString();
};
</script>

<template>
  <div class="border-t border-gray-200 bg-white shadow-strong">
    <div
      class="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all"
      @click="toggleExpand"
    >
      <div class="flex items-center gap-3">
        <component
          :is="isExpanded ? ChevronDown : ChevronUp"
          :size="20"
          class="text-gray-600"
        />
        <div>
          <h3 class="text-sm font-semibold text-gray-900">Execution Log</h3>
          <p v-if="logs.length > 0" class="text-xs text-gray-600 mt-0.5">
            {{ logs.length }} step{{ logs.length !== 1 ? "s" : "" }} executed
          </p>
        </div>
      </div>
      <button
        v-if="logs.length > 0"
        @click.stop="emit('clear')"
        class="p-1.5 hover:bg-gray-300 rounded-md transition-colors"
        title="Clear logs"
      >
        <Trash2 :size="16" class="text-gray-600" />
      </button>
    </div>

    <div v-if="isExpanded" class="max-h-80 overflow-y-auto">
      <div v-if="logs.length === 0" class="p-8 text-center">
        <div
          class="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3"
        >
          <svg
            class="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <p class="text-sm text-gray-600 font-medium">No execution logs yet</p>
        <p class="text-xs text-gray-500 mt-1">
          Run the workflow to see results here
        </p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div
          v-for="(log, index) in logs"
          :key="index"
          class="p-4 hover:bg-gray-50 transition-colors"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded-lg flex items-center justify-center"
                  :class="{
                    'bg-green-100': log.nodeType === 'start',
                    'bg-blue-100': log.nodeType === 'transform',
                    'bg-red-100': log.nodeType === 'end',
                  }"
                >
                  <div
                    class="w-2 h-2 rounded-full"
                    :class="{
                      'bg-green-600': log.nodeType === 'start',
                      'bg-blue-600': log.nodeType === 'transform',
                      'bg-red-600': log.nodeType === 'end',
                    }"
                  />
                </div>
                <span class="text-sm font-semibold text-gray-900">{{
                  log.nodeLabel
                }}</span>
              </div>
              <span
                class="badge text-2xs font-bold uppercase"
                :class="{
                  'bg-green-100 text-green-700': log.nodeType === 'start',
                  'bg-blue-100 text-blue-700': log.nodeType === 'transform',
                  'bg-red-100 text-red-700': log.nodeType === 'end',
                }"
              >
                {{ log.nodeType }}
              </span>
            </div>
            <span class="text-2xs text-gray-500 font-medium">{{
              formatTimestamp(log.timestamp)
            }}</span>
          </div>

          <div class="ml-8 space-y-2.5">
            <div v-if="log.input !== null && log.input !== undefined">
              <div class="text-xs font-semibold text-gray-600 mb-1.5">
                Input
              </div>
              <pre
                class="text-xs text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-3 rounded-lg overflow-x-auto font-mono leading-relaxed"
                >{{ JSON.stringify(log.input, null, 2) }}</pre
              >
            </div>
            <div>
              <div class="text-xs font-semibold text-gray-600 mb-1.5">
                Output
              </div>
              <pre
                class="text-xs text-gray-700 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-3 rounded-lg overflow-x-auto font-mono leading-relaxed"
                >{{ JSON.stringify(log.output, null, 2) }}</pre
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
