<script setup lang="ts">
import { drawImage, drawRect, getBlob, paint } from "@/helper/canvas";
import { ImageCanvaseElement } from "@/models/canvas-element";
import { useCanvasStore } from "@/store/canvas";
import { useAiStore } from "@/store/ai";

import { ref } from "vue";

const canvasStore = useCanvasStore();
const aiStore = useAiStore();

const aiMode = ref<"openai" | "stabilityai">("openai");
const isGenerating = ref(false);
const prompt = ref("");

const imageBlob = ref<Blob | null>(null);
const maskBlob = ref<Blob | null>(null);

async function generateWithOpenAi() {
  isGenerating.value = true;
  // create a canva element
  const canvas = document.createElement("canvas");
  canvas.width = canvasStore.canvasSize.width;
  canvas.height = canvasStore.canvasSize.height;

  // get the context
  const context = canvas.getContext("2d");

  // draw the images
  for (const layer of canvasStore.layers) {
    if (layer.type == "image") {
      drawImage(context as any, layer as ImageCanvaseElement);
    } else if (layer.type == "rectMask") {
      drawRect({ context: context as any, element: layer });
    }
  }

  imageBlob.value = await getBlob(canvas);

  if (imageBlob.value === null) {
    isGenerating.value = false;
    throw new Error("Image blob is null");
  }

  // Paint the mask
  for (const maskPixel of canvasStore.maskPixels) {
    paint({ context: context as any, maskPixel });
  }

  maskBlob.value = await getBlob(canvas);

  if (maskBlob.value === null) {
    isGenerating.value = false;
    throw new Error("Mask blob is null");
  }

  aiStore
    .openaiMaskEdit(imageBlob.value, maskBlob.value, prompt.value)
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      isGenerating.value = false;
    });
}

async function generateWithStability() {
  isGenerating.value = true;
  // create a canva element
  const canvas = document.createElement("canvas");
  canvas.width = canvasStore.canvasSize.width;
  canvas.height = canvasStore.canvasSize.height;

  // get the context
  const context = canvas.getContext("2d");

  // draw the images
  for (const layer of canvasStore.layers) {
    if (layer.type == "image") {
      drawImage(context as any, layer as ImageCanvaseElement);
    }
  }

  imageBlob.value = await getBlob(canvas);

  if (imageBlob.value === null) {
    isGenerating.value = false;
    throw new Error("Image blob is null");
  }

  const masCanvas = document.createElement("canvas");
  masCanvas.width = canvasStore.canvasSize.width;
  masCanvas.height = canvasStore.canvasSize.height;
  const maskContext = masCanvas.getContext("2d");

  // Paint rectmask
  for (const layer of canvasStore.layers) {
    if (layer.type == "rectMask") {
      drawRect({
        context: maskContext as any,
        element: layer,
        fillStyle: "#000000",
        globalCompositeOperation: "source-over",
      });
    }
  }

  // Paint brush mask
  for (const maskPixel of canvasStore.maskPixels) {
    paint({
      context: maskContext as any,
      maskPixel,
      strokeStyle: "#000000",
      globalCompositeOperation: "source-over",
    });
  }

  maskBlob.value = await getBlob(masCanvas);

  if (maskBlob.value === null) {
    isGenerating.value = false;
    throw new Error("Mask blob is null");
  }

  aiStore
    .stabilityMaskEdit(imageBlob.value, maskBlob.value, prompt.value)
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
    <div class="flex-1">
      <v-select
        v-model="aiMode"
        :items="['openai', 'stabilityai']"
        label="AI Mode"
      />
      <v-textarea
        placeholder="Write your prompt here..."
        rows="3"
        v-model="prompt"
      />
    </div>
    <v-btn
      :loading="isGenerating"
      variant="text"
      @click="
        aiMode == 'openai' ? generateWithOpenAi() : generateWithStability()
      "
    >
      Generate
    </v-btn>
  </div>
</template>
