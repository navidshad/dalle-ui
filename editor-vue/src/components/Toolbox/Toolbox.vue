<script setup lang="ts">
import { useToolboxStore, type ToolType } from "@/store/toolbox";
import UploadImage from "./UploadImage.vue";

const store = useToolboxStore();

const toolsDetail: { type: ToolType; icon: string }[] = [
  { type: "none", icon: "mdi-cursor-default" },
  { type: "mask", icon: "mdi-image-filter-center-focus-strong" },
];
</script>

<template>
  <v-navigation-drawer width="80" permanent>
    <!-- Create a list with icons -->
    <v-list class="flex flex-col justify-center items-center space-y-2">
      <v-btn
        variant="text"
        v-for="(tool, ti) of toolsDetail"
        :key="ti"
        :class="[{ 'bg-sky-400 text-white': store.type === tool.type }]"
        @click="store.setType(tool.type)"
      >
        <v-icon>{{ tool.icon }}</v-icon>
      </v-btn>
    </v-list>

    <v-divider :thickness="2" />

    <v-list class="flex flex-col justify-center items-center space-y-2">
      <UploadImage />
    </v-list>
  </v-navigation-drawer>
</template>
