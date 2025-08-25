<template>
  <div :class="gridClasses" class="default-grid">
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  noSpacing: { type: Boolean, default: false }
});

const gridClasses = computed(() => {
  return [
    // 12er-Grid, mit horizontalen Gaps
    'relative grid xl:grid-cols-12 gap-x-6 xl:gap-x-8',
    props.noSpacing ? '' : 'mb-12 xl:mb-20'
  ].join(' ');
});
</script>

<style>
/* WICHTIG: Grid-Kinder dürfen schrumpfen, damit horizontale Overflow-Container funktionieren */
.default-grid > * { min-width: 0; }
</style>
