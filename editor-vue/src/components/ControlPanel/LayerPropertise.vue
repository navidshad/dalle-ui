<script setup lang="ts">
const props = defineProps<{ selectedId: string | null }>();
</script>

<template>
  <div class="bg-sky-200">
    <template v-if="props.selectedId">
      Properties of {{ props.selectedId }}
    </template>
  </div>
</template>
