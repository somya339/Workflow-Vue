<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import { Play } from "lucide-vue-next";
import type { StartNodeData } from "../../types/nodes";

interface Props {
  data: StartNodeData;
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
        : 'border-success-400 shadow-medium hover:shadow-strong'
    "
  >
    <div class="flex items-center gap-3 mb-2">
      <div
        class="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-success-100 to-success-200 rounded-lg"
      >
        <Play :size="18" class="text-success-600" />
      </div>
      <div class="flex-1 min-w-0">
        <div
          class="text-2xs font-bold text-success-600 uppercase tracking-wider mb-0.5"
        >
          Start
        </div>
        <div class="text-sm font-semibold text-gray-900 truncate">
          {{ data.label }}
        </div>
      </div>
    </div>

    <div
      v-if="data.payload"
      class="text-xs text-gray-600 font-mono truncate bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100"
    >
      {{ data.payload.substring(0, 35)
      }}{{ data.payload.length > 35 ? "..." : "" }}
    </div>

    <Handle
      type="source"
      :position="Position.Right"
      class="!bg-green-600 !w-3 !h-3 !border-2 !border-white"
    />
  </div>
</template>
