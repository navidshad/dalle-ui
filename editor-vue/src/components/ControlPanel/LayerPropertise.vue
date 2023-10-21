<script setup lang="ts">
const props = defineProps<{ selectedId: string | null }>();
</script>

<template>
  <div class="">
    <template v-if="props.selectedId">
      Properties of {{ props.selectedId }}
    </template>
  </div>
</template>
