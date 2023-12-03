<template>
  <v-app>
    <Toolbox />
    <ControlPanel />
    <v-main class="w-full">
      <div class="flex-1 overflow-hidden">
        <canvas-renderer />
      </div>
      <prompt-box />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import Toolbox from "./components/Toolbox/Toolbox.vue";
import CanvasRenderer from "./components/CanvasRenderer.vue";
import ControlPanel from "./components/ControlPanel/ControlPanel.vue";
import PromptBox from "./components/PromptBox.vue";
</script>
