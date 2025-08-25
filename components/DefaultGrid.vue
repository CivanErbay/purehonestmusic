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
    'relative grid xl:grid-cols-12',
    props.noSpacing ? '' : 'mb-12 xl:mb-20'
  ].join(' ');
});
</script>

<style>
/* WICHTIG: Grid-Kinder dürfen schrumpfen, damit horizontale Overflow-Container funktionieren */
.default-grid > * {
  min-width: 0;
}
</style>
