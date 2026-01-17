import type { WorkflowExport } from "../types/workflow";

const STORAGE_KEY = "workflow-builder-state";
const AUTOSAVE_DELAY = 2000;

class StorageService {
  private saveTimeout: number | null = null;

  saveWorkflow(workflow: WorkflowExport): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
    } catch (error) {
      console.error("Failed to save workflow:", error);
    }
  }

  loadWorkflow(): WorkflowExport | null {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Failed to load workflow:", error);
    }
    return null;
  }

  clearStorage(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }
  }

  autoSave(workflow: WorkflowExport): void {
    if (this.saveTimeout !== null) {
      clearTimeout(this.saveTimeout);
    }

    this.saveTimeout = globalThis.setTimeout(() => {
      this.saveWorkflow(workflow);
      this.saveTimeout = null;
    }, AUTOSAVE_DELAY);
  }
}

export const storageService = new StorageService();
