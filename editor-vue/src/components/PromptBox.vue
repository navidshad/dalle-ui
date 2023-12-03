<script setup lang="ts">
import { drawImage, drawRect, getBlob, paint } from "@/helper/canvas";
import { ImageCanvaseElement } from "@/models/canvas-element";
import { useCanvasStore } from "@/store/canvas";
import { useAiStore } from "@/store/ai";

import { ref } from "vue";

const canvasStore = useCanvasStore();
const aiStore = useAiStore();

const aiMode = ref<"openai" | "stabilityai">("openai");
const size = ref<"1024x1024" | "1792x1024" | "1024x1792">("1024x1024");
const quality = ref<"standard" | "hd">("standard");
const isGenerating = ref(false);
const prompt = ref("");

const imageBlob = ref<Blob | null>(null);
const maskBlob = ref<Blob | null>(null);

async function editWithOpenAi() {
  isGenerating.value = true;

  // create a canva element
  const canvas = document.createElement("canvas");
  canvas.width = canvasStore.canvasSize.width;
  canvas.height = canvasStore.canvasSize.height;

  // get the context
  const context = canvas.getContext("2d");

  // draw the images
  for (const layer of canvasStore.layers) {
    if (layer.hidden) continue;
    if (layer.type !== "image") continue;

    drawImage(context as any, layer as ImageCanvaseElement);
  }

  imageBlob.value = await getBlob(canvas);

  if (imageBlob.value === null) {
    isGenerating.value = false;
    throw new Error("Image blob is null");
  }

  //
  // Paint the mask
  //

  // Paint rectmask
  for (const layer of canvasStore.layers) {
    if (layer.hidden) continue;
    if (layer.type == "rectMask") {
      drawRect({
        context: context as any,
        element: layer,
        fillStyle: "#000000",
        globalCompositeOperation: "destination-out",
      });
    }
  }

  // Paint brush mask
  for (const maskPixel of canvasStore.maskPixels) {
    paint({
      context: context as any,
      maskPixel,
      strokeStyle: "#000000",
      globalCompositeOperation: "destination-out",
    });
  }

  maskBlob.value = await getBlob(canvas);

  if (maskBlob.value === null) {
    isGenerating.value = false;
    throw new Error("Mask blob is null");
  }

  // Open blobs in blank tabs
  // const maskBlobUrl = URL.createObjectURL(maskBlob.value);
  // window.open(maskBlobUrl, "_blank");

  const size =
    canvasStore.canvasSize.width + "x" + canvasStore.canvasSize.height;

  aiStore
    .openaiMaskEdit(imageBlob.value, maskBlob.value, size, prompt.value)
    .then(async (base64) => {
      const imageLayer = await ImageCanvaseElement.fromBase64Image({
        base64: base64,
        width: canvas.width,
        height: canvas.height,
        x: 0,
        y: 0,
      });

      canvasStore.clearMaskPixels();
      canvasStore.addElementLayer(imageLayer);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      isGenerating.value = false;
    });
}

async function getVariationWithOpenAi() {
  isGenerating.value = true;

  // create a canva element
  const canvas = document.createElement("canvas");
  canvas.width = canvasStore.canvasSize.width;
  canvas.height = canvasStore.canvasSize.height;

  // get the context
  const context = canvas.getContext("2d");

  // draw the images
  for (const layer of canvasStore.layers) {
    if (layer.hidden) continue;
    if (layer.type !== "image") continue;

    drawImage(context as any, layer as ImageCanvaseElement);
  }

  //
  // Paint the mask
  //

  // Paint rectmask
  for (const layer of canvasStore.layers) {
    if (layer.hidden) continue;
    if (layer.type == "rectMask") {
      drawRect({
        context: context as any,
        element: layer,
        fillStyle: "#000000",
        globalCompositeOperation: "destination-out",
      });
    }
  }

  // Paint brush mask
  for (const maskPixel of canvasStore.maskPixels) {
    paint({
      context: context as any,
      maskPixel,
      strokeStyle: "#000000",
      globalCompositeOperation: "destination-out",
    });
  }

  imageBlob.value = await getBlob(canvas);

  if (imageBlob.value === null) {
    isGenerating.value = false;
    throw new Error("Image blob is null");
  }

  // Open blobs in blank tabs
  // const imageBlobUrl = URL.createObjectURL(imageBlob.value);
  // window.open(imageBlobUrl, "_blank");

  const size =
    canvasStore.canvasSize.width + "x" + canvasStore.canvasSize.height;

  aiStore
    .openaiGenerateVariation(imageBlob.value, size)
    .then(async (base64) => {
      const imageLayer = await ImageCanvaseElement.fromBase64Image({
        base64: base64,
        width: canvas.width,
        height: canvas.height,
        x: 0,
        y: 0,
      });

      canvasStore.clearMaskPixels();
      canvasStore.addElementLayer(imageLayer);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      isGenerating.value = false;
    });
}

async function generateWithOpenAi() {
  isGenerating.value = true;

  const submittedPrompt = prompt.value;
  const submittedSize = size.value;
  const submittedQuality = quality.value;

  aiStore
    .openaiGenerate(submittedPrompt, submittedSize, submittedQuality)
    .then(async (base64) => {
      const imageLayer = await ImageCanvaseElement.fromBase64Image({
        base64: base64,
        width: parseInt(submittedSize.split("x")[0]),
        height: parseInt(submittedSize.split("x")[1]),
        x: 0,
        y: 0,
      });

      // canvasStore.clearLayers();
      canvasStore.clearMaskPixels();
      canvasStore.addElementLayer(imageLayer);
    })
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
    <!-- Prompt properties -->
    <div class="flex-1">
      <div class="flex space-x-2">
        <v-select
          v-model="aiMode"
          :items="[
            'openai',
            // 'stabilityai'
          ]"
          label="AI Mode"
        />
        <v-select
          v-model="size"
          :items="[
            { title: '1024x1024', value: '1024x1024' },
            // { title: '1792x1024', value: '1792x1024' },
            // { title: '1024x1792', value: '1024x1792' },
          ]"
          label="Size"
        />
        <v-select
          v-model="quality"
          :items="[
            { title: 'Standard $0.040', value: 'standard' },
            { title: 'HD $0.080', value: 'hd' },
          ]"
          label="quality"
        />
      </div>

      <v-textarea
        placeholder="Write your prompt here..."
        rows="3"
        v-model="prompt"
      />
    </div>

    <!-- Action buttons -->
    <div class="flex flex-col">
      <v-btn
        :loading="isGenerating"
        variant="text"
        @click="aiMode == 'openai' ? editWithOpenAi() : generateWithStability()"
        :disabled="prompt.length == 0"
        v-if="canvasStore.layers.length > 0"
      >
        Edit
      </v-btn>

      <!-- let's waite for dall-3 -->
      <!-- <v-btn
        :loading="isGenerating"
        variant="text"
        @click="getVariationWithOpenAi()"
        v-if="canvasStore.layers.length > 0"
      >
        New Variation
      </v-btn> -->

      <v-btn
        :loading="isGenerating"
        :disabled="prompt.length == 0"
        variant="text"
        @click="
          aiMode == 'openai' ? generateWithOpenAi() : generateWithStability()
        "
      >
        Generate
      </v-btn>
    </div>
  </div>
</template>
