<template>
  <v-app>
    <Toolbox />
    <v-main>
      <ImageEditor />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import ImageEditor from "./components/ImageEditor.vue";
import Toolbox from "./components/Toolbox/Toolbox.vue";
</script>
