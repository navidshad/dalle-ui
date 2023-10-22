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

function removeElementLayer(id: string) {
  canvasStore.removeElementLayer(id);
  if (selectedElement.value === id) {
    selectedElement.value = null;
  }
}
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

        <template #append>
          <v-btn
            icon
            @click.stop="removeElementLayer(layer.id)"
            class="ml-auto"
            size="xs"
            variant="text"
            dense
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>
