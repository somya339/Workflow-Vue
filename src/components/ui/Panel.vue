<script setup lang="ts">
interface Props {
  title?: string;
  collapsible?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: "",
  collapsible: false,
});
</script>

<template>
  <div class="bg-white border border-gray-200 rounded-lg shadow-sm">
    <div v-if="title" class="px-4 py-3 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
    </div>
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
