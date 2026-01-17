<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import { CheckCircle } from "lucide-vue-next";
import type { EndNodeData } from "../../types/nodes";

interface Props {
  data: EndNodeData;
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
        : 'border-danger-400 shadow-medium hover:shadow-strong'
    "
  >
    <div class="flex items-center gap-3 mb-2">
      <div
        class="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-danger-100 to-danger-200 rounded-lg"
      >
        <CheckCircle :size="18" class="text-danger-600" />
      </div>
      <div class="flex-1 min-w-0">
        <div
          class="text-2xs font-bold text-danger-600 uppercase tracking-wider mb-0.5"
        >
          End
        </div>
        <div class="text-sm font-semibold text-gray-900 truncate">
          {{ data.label }}
        </div>
      </div>
    </div>

    <div
      v-if="data.receivedPayload"
      class="text-xs text-gray-600 font-mono truncate bg-gray-50 px-2.5 py-1.5 rounded border border-gray-100"
    >
      {{ JSON.stringify(data.receivedPayload).substring(0, 35) }}...
    </div>

    <Handle
      type="target"
      :position="Position.Left"
      class="!bg-red-600 !w-3 !h-3 !border-2 !border-white"
    />
  </div>
</template>
