<template>
  <DefaultGrid :no-spacing="true">
    <div class="lg:col-start-3 lg:col-end-11">
      <div
        v-for="(group, date, index) in visibleGroupedItems"
        :key="date"
        class="mb-16"
      >
        <p class="text-2xl font-semibold mb-6">
          <span :class="{ underline: weekDay(group[0].date) === 'Heute' }"
            >{{ weekDay(group[0].date) }},</span
          >
          {{ date }}
        </p>
        <ItemsConcert
          v-for="item in group"
          :key="item.slug"
          class="lg:col-start-3 lg:col-end-11"
          :item="item"
        >
        </ItemsConcert>
      </div>
      <div v-if="showMoreButton" class="flex justify-center">
        <button
          @click="showMoreDays"
          class="px-8 py-2 bg-orange-500 text-white rounded"
          :class="{
            'opacity-50 pointer-events-none':
              totalVisibleConcerts >= totalConcerts,
          }"
        >
          Mehr Konzerte anzeigen
        </button>
      </div>

      <div class="flex justify-center mt-2 text-gray-400 mb-16">
        <p class="text-sm">
          {{ totalVisibleConcerts }} von {{ totalConcerts }} Konzerten
        </p>
      </div>
    </div>
  </DefaultGrid>
</template>
<script setup>
const { items, searchQuery } = defineProps({
  searchQuery: String,
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const maxDays = ref(3);
const showMoreButton = ref(false);

const filteredGroupedItems = computed(() => {
  const query = searchQuery.toLowerCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredItems = items
    .filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
    )
    .filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (filteredItems.length > 5) {
    showMoreButton.value = true;
  }

  return filteredItems.reduce((groups, item) => {
    const dateKey = formattedDate(item.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {});
});

const visibleGroupedItems = computed(() => {
  const groupedDates = Object.keys(filteredGroupedItems.value);
  return groupedDates.slice(0, maxDays.value).reduce((result, date) => {
    result[date] = filteredGroupedItems.value[date];
    return result;
  }, {});
});

const totalVisibleConcerts = computed(() => {
  return Object.values(visibleGroupedItems.value).flat().length;
});

const totalConcerts = computed(() => {
  return Object.values(filteredGroupedItems.value).flat().length;
});

const showMoreDays = () => {
  maxDays.value += 3;
};
</script>
