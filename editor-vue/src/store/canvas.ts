import { CanvasElement } from "@/models/canvas-element";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useCanvasStore = defineStore("canvase", () => {
  const canvasRef = ref<HTMLCanvasElement | null>(null);
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

  function updateElementLayer(element: CanvasElement) {
    const index = layers.value.findIndex((e) => e.id === element.id);
    if (index !== -1) layers.value.splice(index, 1, element);
  }

  function clearLayers() {
    layers.value = [];
  }

  function addMaskPixel(x: number, y: number) {
    if (maskPixels.value.some((pixel) => pixel[0] === x && pixel[1] === y)) {
      return;
    }

    const rect = canvasRef.value?.getBoundingClientRect() as DOMRect; // Get the bounding box of the canvas

    const scaleX = (canvasRef.value?.width as number) / rect.width;
    const scaleY = (canvasRef.value?.height as number) / rect.height;
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;

    // console.log(x, y, rect);
    // console.log(canvasX, canvasY);
    // console.log("---");

    maskPixels.value.push([canvasX, canvasY]);
  }

  function setCanvasRef(el: HTMLCanvasElement | null) {
    canvasRef.value = el;
  }

  return {
    canvasRef,
    layers,
    maskPixels,
    addElementLayer,
    getElementLayer,
    updateElementLayer,
    removeElementLayer,
    clearLayers,
    setCanvasRef,
    addMaskPixel,
  };
});
