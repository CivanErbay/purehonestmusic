<template>
  <DefaultGrid>
    <div class="lg:col-start-3 lg:col-end-11 mt-5 lg:mt-10">
      <h4 class="text-2xl font-semibold mb-6">{{ headline }}</h4>
      <ItemsConcertRecommendations :items="filteredGroupedItems" />

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

/* console.log("blub", filteredGroupedItems) */

const filteredGroupedItems = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return items
    .filter((item) => new Date(item.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
});
</script>
