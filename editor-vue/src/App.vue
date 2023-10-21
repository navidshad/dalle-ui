<template>
  <v-app>
    <Toolbox />
    <v-main class="h-screen w-full">
      <canvas-renderer />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Toolbox from "./components/Toolbox/Toolbox.vue";
import CanvasRenderer from "./components/CanvasRenderer.vue";
</script>
