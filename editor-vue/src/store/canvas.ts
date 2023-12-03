import { CanvasElement } from "@/models/canvas-element";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCanvasStore = defineStore("canvase", () => {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  const canvasSize = ref<{ width: number; height: number }>({
    width: 1024,
    height: 1024,
  });

  const layers = ref<CanvasElement[]>([]);
  const maskPixels = ref<number[][]>([]);

  function addElementLayer(element: CanvasElement) {
    layers.value.push(element);
  }

  function removeElementLayer(id: string) {
    const index = layers.value.findIndex((element) => element.id === id);
    if (index !== -1) layers.value.splice(index, 1);
  }

  function getElementLayer(id: string) {
    return layers.value.find((element) => element.id === id) || null;
  }

  function clearLayers() {
    layers.value = [];
  }

  function addMaskPixel(x: number, y: number) {
    if (maskPixels.value.some((pixel) => pixel[0] === x && pixel[1] === y)) {
      return;
    }

    const rect = canvasRef.value?.getBoundingClientRect() as DOMRect; // Get the bounding box of the canvas

    // Get the mouse position relative to the canvas
    const canvasX = Math.floor(x);
    const canvasY = Math.floor(y);

    maskPixels.value.push([canvasX, canvasY]);
  }

  function clearMaskPixels() {
    maskPixels.value = [];
  }

  function setCanvasRef(el: HTMLCanvasElement | null) {
    canvasRef.value = el;
  }

  function setActive(id: any, key: boolean) {
    const index = layers.value.findIndex((element) => element.id === id);
    if (index !== -1) layers.value[index].hidden = key;
  }

  return {
    canvasRef,
    canvasSize,
    layers,
    maskPixels,
    addElementLayer,
    getElementLayer,
    removeElementLayer,
    clearLayers,
    setCanvasRef,
    addMaskPixel,
    clearMaskPixels,
    setActive,
  };
});
