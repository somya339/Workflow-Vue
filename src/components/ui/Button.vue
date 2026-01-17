<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  disabled: false,
});

const classes = computed(() => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

  const variantClasses = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md focus:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 hover:shadow-sm focus:ring-gray-500 border border-gray-300",
    danger:
      "bg-red-600 text-white hover:bg-red-700 hover:shadow-md focus:ring-red-500",
  };

  const sizeClasses = {
    sm: "px-3.5 py-2 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return `${baseClasses} ${variantClasses[props.variant]} ${sizeClasses[props.size]}`;
});

const buttonStyles = computed(() => {
  const styles: Record<string, string> = {};

  if (props.variant === "primary") {
    styles.backgroundColor = "#2563eb";
    styles.color = "#ffffff";
  } else if (props.variant === "secondary") {
    styles.backgroundColor = "#e5e7eb";
    styles.color = "#111827";
  } else if (props.variant === "danger") {
    styles.backgroundColor = "#dc2626";
    styles.color = "#ffffff";
  }

  return styles;
});
</script>

<template>
  <button :class="classes" :disabled="disabled" :style="buttonStyles">
    <slot />
  </button>
</template>
