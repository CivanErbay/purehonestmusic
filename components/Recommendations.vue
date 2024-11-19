<template>
  <DefaultGrid>
    <div class="lg:col-start-3 lg:col-end-11 mt-5 lg:mt-10">
      <h4 class="text-2xl font-semibold mb-6">{{ headline }}</h4>
      <div class="flex flex-col lg:flex-row gap-x-8 relative">
        <ItemsHighlightConcert
          v-for="item in filteredGroupedItems.slice(0, 3)"
          :key="item.slug"
          :item="item"
        />
        <div
          class="absolute h-full w-10 bg-[#242424] -right-12 top-0 hidden lg:flex items-center justify-center rounded-xl cursor-pointer"
        >
          <NuxtImg src="/arrow-right.svg" class="" />
        </div>
      </div>
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

const filteredGroupedItems = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredItems = items
    .filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // if (filteredItems.length > 5) {
  //   showMoreButton.value = true;
  // }

  return filteredItems;
});
</script>
