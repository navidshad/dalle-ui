<script setup lang="ts">
import { ImageCanvaseElement } from "@/models/canvas-element";
import { useCanvasStore } from "@/store/canvas";
import { ref } from "vue";

const canvasStore = useCanvasStore();
const fileEl = ref<HTMLInputElement | null>(null);

function triggerFileInput() {
  // clear file
  fileEl.value!.value = "";

  // trigger file input
  fileEl.value?.click();
}

function onFileChange() {
  console.log("watching files");

  // get file from input
  const file = fileEl.value?.files?.[0];
  if (!file) return;

  // create image element
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = () => {
    // create a new image
    const canvaseElement = new ImageCanvaseElement({
      src: image,
      x: 0,
      y: 0,
      width: image.naturalWidth,
      height: image.naturalHeight,
    });

    canvasStore.addElementLayer(canvaseElement);
  };
}
</script>

<template>
  <v-btn variant="text" @click="triggerFileInput">
    <v-icon>mdi-cloud-upload</v-icon>
    <input
      ref="fileEl"
      type="file"
      class="hidden"
      accept="image/*"
      @change="onFileChange"
    />
  </v-btn>
</template>
