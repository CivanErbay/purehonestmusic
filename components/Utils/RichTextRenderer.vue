<template>
  <ClientOnly>
    <p v-html="html"></p>
  </ClientOnly>
</template>

<script setup>
const props = defineProps({
  nodes: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const html = computed(() => {
  return slateToHtml(props.nodes);
});
</script>

<style lang="scss" scoped></style>
