<script setup lang="ts">
import { useCanvasStore } from "@/store/canvas";
import { useToolboxStore } from "@/store/toolbox";
import { watch, computed, ref } from "vue";

const toolboxStore = useToolboxStore();
const canvasStore = useCanvasStore();

const isActive = computed(() => toolboxStore.type === "mask-brush");
const isPainting = ref(false);

watch(
  () => isActive.value,
  (active) => {
    if (!active) {
      canvasStore.clearMaskPixels();
    }
  },
  { immediate: true }
);

watch(
  () => isActive.value,
  () => {
    if (isActive.value) {
      window.addEventListener("mousedown", startPosition);
      window.addEventListener("mousemove", onPainting);
      window.addEventListener("mouseup", endPosition);
    } else {
      window.removeEventListener("mousedown", startPosition);
      window.removeEventListener("mousemove", onPainting);
      window.removeEventListener("mouseup", endPosition);
    }
  }
);

function startPosition() {
  isPainting.value = true;
}

function onPainting(e: MouseEvent) {
  if (!isPainting.value) return;
  canvasStore.addMaskPixel(e.offsetX, e.offsetY);
}

function endPosition() {
  isPainting.value = false;
}
</script>

<template>
  <v-btn variant="text">
    <v-icon>mdi-image-filter-center-focus-strong</v-icon>
  </v-btn>
</template>
