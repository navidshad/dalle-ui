<script setup lang="ts">
import { useToolboxStore } from "@/store/toolbox";
import UploadImage from "./UploadImage.vue";
import MaskArea from "./MaskArea.vue";

const store = useToolboxStore();
</script>

<template>
  <v-navigation-drawer width="80" permanent>
    <!-- Create a list with icons -->
    <v-list class="flex flex-col justify-center items-center space-y-2">
      <v-btn
        variant="text"
        :class="[{ 'bg-sky-400 text-white': store.type === 'none' }]"
        @click="store.setType('none')"
      >
        <v-icon>mdi-cursor-default</v-icon>
      </v-btn>

      <MaskArea
        :class="[{ 'bg-sky-400 text-white': store.type === 'mask' }]"
        @click="store.setType('mask')"
      />
    </v-list>

    <v-divider :thickness="2" />

    <v-list class="flex flex-col justify-center items-center space-y-2">
      <UploadImage />
    </v-list>
  </v-navigation-drawer>
</template>
