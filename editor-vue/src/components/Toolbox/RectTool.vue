<script setup lang="ts">
import { CanvasElement } from "@/models/canvas-element";
import { useCanvasStore } from "@/store/canvas";
import { useToolboxStore } from "@/store/toolbox";
import { computed, ref, watch } from "vue";

const toolboxStore = useToolboxStore();
const canvasStore = useCanvasStore();

const isActive = computed(() => toolboxStore.type === "mask-rectangle");
const isPainting = ref(false);

const selectArea = ref({
  width: 0,
  height: 0,
  x: 0,
  y: 0,
});

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

function addRect() {
  canvasStore.addElementLayer(
    new CanvasElement({
      type: "rectMask",
      x: selectArea.value.x,
      y: selectArea.value.y,
      width: selectArea.value.width,
      height: selectArea.value.height,
      id: "rect-" + new Date().getTime(),
    })
  );
}

function startPosition(e: MouseEvent) {
  isPainting.value = true;
  selectArea.value.x = e.offsetX;
  selectArea.value.y = e.offsetY;

  selectArea.value.width = 0;
  selectArea.value.height = 0;
}

function onPainting(e: MouseEvent) {
  if (!isPainting.value) return;

  selectArea.value.width = e.offsetX - selectArea.value.x;
  selectArea.value.height = e.offsetY - selectArea.value.y;
}

function endPosition() {
  isPainting.value = false;

  addRect();
  toolboxStore.setType("none");

  // selectArea.value = {
  //   width: 0,
  //   height: 0,
  //   x: 0,
  //   y: 0,
  // };
}
</script>

<template>
  <v-btn variant="text">
    <!-- rect icon -->
    <v-icon>mdi-rectangle-outline</v-icon>

    <template v-if="isPainting">
      <teleport to="#canvas-container">
        <div
          class="absolute z-50 border-2 border-yellow-300"
          :style="{
            'min-width': selectArea.width + 'px',
            'min-height': selectArea.height + 'px',
            top: selectArea.y + 'px',
            left: selectArea.x + 'px',
          }"
        />
      </teleport>
    </template>
  </v-btn>
</template>
