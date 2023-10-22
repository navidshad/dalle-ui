<script setup lang="ts">
import { CanvasElement } from "@/models/canvas-element";
import { useCanvasStore } from "@/store/canvas";
import { watch } from "vue";
import { ref } from "vue";

const props = defineProps<{ selectedId: string | null }>();
const canvasStore = useCanvasStore();
const layer = ref<CanvasElement | null>(null);

watch(
  () => props.selectedId,
  (id) => {
    layer.value = canvasStore.getElementLayer(id || "");
  },
  { immediate: true }
);
</script>

<template>
  <div class="">
    <template v-if="props.selectedId && layer">
      <v-text-field v-model="layer.id" label="Layer Name" outlined dense />

      <!-- position -->
      <div class="flex space-x-2">
        <v-text-field
          v-model="layer.x"
          label="X"
          outlined
          dense
          type="number"
        />

        <v-text-field
          v-model="layer.y"
          label="Y"
          outlined
          dense
          type="number"
        />
      </div>

      <!-- Size -->
      <div class="flex space-x-2">
        <v-text-field
          v-model="layer.width"
          label="Width"
          outlined
          dense
          type="number"
        />

        <v-text-field
          v-model="layer.height"
          label="Height"
          outlined
          dense
          type="number"
        />
      </div>
    </template>
  </div>
</template>
