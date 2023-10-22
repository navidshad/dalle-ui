<script setup lang="ts">
import { drawImage, drawRect, getBlob, paint } from "@/helper/canvas";
import { ImageCanvaseElement } from "@/models/canvas-element";
import { useCanvasStore } from "@/store/canvas";
import { useOpenAiStore } from "@/store/openai";

import { ref } from "vue";

const canvasStore = useCanvasStore();
const openAiStore = useOpenAiStore();

const isGenerating = ref(false);
const prompt = ref("");

const imageBlob = ref<Blob | null>(null);
const maskBlob = ref<Blob | null>(null);

async function prepare() {
  isGenerating.value = true;
  // create a canva element
  const canvas = document.createElement("canvas");
  canvas.width = 700;
  canvas.height = 700;

  // get the context
  const context = canvas.getContext("2d");

  // draw the images
  for (const layer of canvasStore.layers) {
    if (layer.type == "image") {
      drawImage(context as any, layer as ImageCanvaseElement);
    } else if (layer.type == "rect") {
      drawRect(context as any, layer);
    }
  }

  imageBlob.value = await getBlob(canvas);

  if (imageBlob.value === null) {
    isGenerating.value = false;
    throw new Error("Image blob is null");
  }

  // Paint the mask
  for (const maskPixel of canvasStore.maskPixels) {
    paint(context as any, maskPixel);
  }

  maskBlob.value = await getBlob(canvas);

  if (maskBlob.value === null) {
    isGenerating.value = false;
    throw new Error("Mask blob is null");
  }

  openAiStore
    .editImage(imageBlob.value, maskBlob.value, prompt.value)
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      isGenerating.value = false;
    });
}
</script>

<template>
  <div class="flex justify-center items-center space-x-2 px-4">
    <v-textarea
      placeholder="Write your prompt here..."
      rows="3"
      class="flex-1"
      v-model="prompt"
    />
    <v-btn :loading="isGenerating" variant="text" @click="prepare"
      >Generate</v-btn
    >
  </div>
</template>
