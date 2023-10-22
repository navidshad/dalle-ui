<script setup lang="ts">
import { drawImage, paint } from "@/helper/canvas";
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
      canvasStore.setCanvasRef(canvasEl.value);

      draw();
    }
  }
);

watch(
  [() => canvasStore.maskPixels, () => canvasStore.layers],
  () => {
    draw();
  },
  { deep: true }
);

function draw() {
  if (!context.value) return;

  for (const layer of canvasStore.layers) {
    switch (layer.type) {
      case "image":
        drawImage(context.value, layer as ImageCanvaseElement);
        break;
      case "mask":
        // drawMask(element);
        break;
    }
  }

  // draw mask
  for (const pixel of canvasStore.maskPixels) {
    // context.value.fillStyle = "rgba(0, 0, 0, 0.5)";
    // context.value.fillRect(x, y, 1, 1);

    const context = canvasEl.value?.getContext("2d");
    if (!context) return;

    paint(context, pixel);
  }
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
