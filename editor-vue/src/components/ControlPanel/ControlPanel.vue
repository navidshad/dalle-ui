<script setup lang="ts">
import Split from "split.js";
import { onMounted, ref } from "vue";
import HierarchyList from "./HierarchyList.vue";
import LayerPropertise from "./LayerPropertise.vue";

const selectedId = ref<string | null>(null);

onMounted(() => {
  Split(["#split-0", "#split-1"], {
    direction: "vertical",
  });
});
</script>

<template>
  <v-navigation-drawer location="right" permanent>
    <div class="split h-screen">
      <LayerPropertise :selectedId="selectedId" id="split-0" />
      <HierarchyList @select="selectedId = $event" id="split-1" />
    </div>
  </v-navigation-drawer>
</template>

<style>
.gutter {
  background-color: #eee;
  background-repeat: no-repeat;
  background-position: 50%;
}

.gutter.gutter-vertical {
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
  cursor: row-resize;
}
</style>
