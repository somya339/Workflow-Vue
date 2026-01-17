import { onMounted, onUnmounted } from "vue";

export function useKeyboardShortcuts(callbacks: {
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
}) {
  const handleKeyDown = (event: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    const isCtrlOrCmd = isMac ? event.metaKey : event.ctrlKey;

    if (isCtrlOrCmd && event.key === "z" && !event.shiftKey) {
      event.preventDefault();
      callbacks.onUndo?.();
    } else if (
      (isCtrlOrCmd && event.key === "y") ||
      (isCtrlOrCmd && event.shiftKey && event.key === "z")
    ) {
      event.preventDefault();
      callbacks.onRedo?.();
    } else if (event.key === "Delete" || event.key === "Backspace") {
      const target = event.target as HTMLElement;
      if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
        event.preventDefault();
        callbacks.onDelete?.();
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      callbacks.onEscape?.();
    }
  };

  onMounted(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });
}
