<template>
  <div :class="gridClasses">
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  noSpacing: {
    type: Boolean,
    required: false,
    default: false
  }
})

const gridClasses = computed(() => {
  return [
    'relative grid xl:grid-cols-12',
    props.noSpacing ? '' : 'mb-12 xl:mb-20'
  ].join(' ')
})
</script>
