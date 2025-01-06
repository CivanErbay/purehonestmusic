<template>
  <DefaultGrid>
    <div class="w-[90svw] sm:w-[89svw] xl:w-auto xl:col-start-3 xl:col-end-11 mt-5 xl:mt-10">
      <h4 class="text-2xl font-semibold mb-6">{{ headline }}</h4>
      <ItemsConcertSlider :items="items"></ItemsConcertSlider>
    </div>
  </DefaultGrid>
</template>

<script setup>
const { items, headline } = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  headline: {
    type: String,
    required: false,
    default: '',
  },
});


/* const filteredGroupedItems = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return items
    .filter((item) => new Date(item.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
}); */
</script>
