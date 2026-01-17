<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import { Repeat } from "lucide-vue-next";
import type { TransformNodeData } from "../../types/nodes";

interface Props {
  data: TransformNodeData;
  selected?: boolean;
}

defineProps<Props>();
</script>

<template>
  <div
    class="px-4 py-3 rounded-lg border-2 bg-white min-w-[200px] transition-all duration-200"
    :class="
      selected
        ? 'border-primary-500 shadow-strong'
        : 'border-primary-400 shadow-medium hover:shadow-strong'
    "
  >
    <div class="flex items-center gap-3 mb-2">
      <div
        class="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg"
      >
        <Repeat :size="18" class="text-primary-600" />
      </div>
      <div class="flex-1 min-w-0">
        <div
          class="text-2xs font-bold text-primary-600 uppercase tracking-wider mb-0.5"
        >
          Transform
        </div>
        <div class="text-sm font-semibold text-gray-900 truncate">
          {{ data.label }}
        </div>
      </div>
    </div>

    <div
      class="text-xs text-gray-600 bg-gradient-to-br from-gray-50 to-gray-100 px-2.5 py-1.5 rounded border border-gray-100"
    >
      <span class="font-semibold text-gray-800">{{ data.operation }}</span>
      <span v-if="data.value" class="text-gray-500"> ({{ data.value }})</span>
    </div>

    <Handle
      type="target"
      :position="Position.Left"
      class="!bg-blue-600 !w-3 !h-3 !border-2 !border-white"
    />
    <Handle
      type="source"
      :position="Position.Right"
      class="!bg-blue-600 !w-3 !h-3 !border-2 !border-white"
    />
  </div>
</template>
