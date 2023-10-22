<script setup lang="ts">
import { CanvasElement } from "@/models/canvas-element";
import { useCanvasStore } from "@/store/canvas";

const canvasStore = useCanvasStore();

function addRect() {
  canvasStore.addElementLayer(
    new CanvasElement({
      type: "rectMask",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
      id: "rect-" + (canvasStore.layers.length + 1),
    })
  );
}
</script>

<template>
  <v-btn variant="text" @click="addRect">
    <!-- rect icon -->
    <v-icon>mdi-rectangle-outline</v-icon>
  </v-btn>
</template>
