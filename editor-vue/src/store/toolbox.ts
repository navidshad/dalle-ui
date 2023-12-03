// Utilities
import { defineStore } from "pinia";
import { ref } from "vue";

export type ToolType = "none" | "mask";

export const useToolboxStore = defineStore("toolbox", () => {
  const type = ref<ToolType>("none");

  function setType(newType: ToolType) {
    type.value = newType;
  }

  return {
    type,
    setType,
  };
});
