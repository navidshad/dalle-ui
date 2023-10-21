<script setup lang="ts">
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
  <div class="">
    <v-list>
      <v-list-item
        v-for="layer in canvasStore.layers"
        :key="layer.id"
        @click="selectedElement = layer.id"
        :class="[{ 'bg-gray-200': layer.id === selectedElement }]"
      >
        <v-list-item-content>
          {{ layer.id }}
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
