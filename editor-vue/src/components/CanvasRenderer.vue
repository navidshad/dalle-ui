<script setup lang="ts">
import { ImageCanvaseElement } from "@/models/canvas-element";
import { useCanvasStore } from "@/store/canvas";
import { ref, watch } from "vue";

const props = defineProps({
  width: {
    type: Number,
    default: 700,
  },
  height: {
    type: Number,
    default: 700,
  },
});

const canvasStore = useCanvasStore();
const canvasEl = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);

watch(
  () => canvasEl.value,
  (el) => {
    if (el) {
      context.value = canvasEl.value?.getContext("2d") || null;
      draw();
    }
  }
);

watch(
  () => canvasStore.elements,
  () => {
    draw();
  },
  { deep: true }
);

function draw() {
  if (!context.value) return;

  for (const element of canvasStore.elements) {
    switch (element.type) {
      case "image":
        drawImage(element as ImageCanvaseElement);
        break;
      case "mask":
        // drawMask(element);
        break;
    }
  }
}

function drawImage(element: ImageCanvaseElement) {
  if (!context.value) return;

  const image = new Image();
  image.src = element.src;
  image.onload = () => {
    context.value?.drawImage(
      image,
      element.x,
      element.y,
      element.width,
      element.height
    );

    // clear image from image tag
    element.src = "";
  };
}
</script>

<template>
  <section class="flex justify-center items-center w-full h-full">
    <canvas
      ref="canvasEl"
      :width="props.width"
      :height="props.height"
      class="rounded bg-gray-300"
    />
  </section>
</template>
