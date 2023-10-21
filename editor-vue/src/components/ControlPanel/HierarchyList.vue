<script setup lang="ts">
import { CanvasElement } from "@/models/canvas-element";
import { useCanvasStore } from "@/store/canvas";
import { ref, watch } from "vue";

const canvasStore = useCanvasStore();
const emit = defineEmits<{
  (event: "select", id: string | null): void;
}>();

const selectedElement = ref<string | null>(null);

watch(
  () => selectedElement.value,
  () => emit("select", selectedElement.value)
);
</script>

<template>
  <div class="bg-sky-100">
    <v-list>
      <v-list-item
        v-for="element in canvasStore.elements"
        :key="element.id"
        @click="selectedElement = element.id"
      >
        <v-list-item-content>
          {{ element.id }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
