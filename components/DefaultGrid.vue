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
    'relative grid lg:grid-cols-12 gap-x-1',
    props.noSpacing ? '' : 'mb-12 lg:mb-20'
  ].join(' ')
})
</script>
