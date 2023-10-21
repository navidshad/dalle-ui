import { CanvasElement } from "@/models/canvas-element";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCanvasStore = defineStore("canvase", () => {
  const elements = ref<CanvasElement[]>([]);

  function addElement(element: CanvasElement) {
    elements.value.push(element);
  }

  function removeElement(id: string) {
    const index = elements.value.findIndex((element) => element.id === id);
    if (index !== -1) elements.value.splice(index, 1);
  }

  function clear() {
    elements.value = [];
  }

  return {
    elements,
    addElement,
    removeElement,
    clear,
  };
});
