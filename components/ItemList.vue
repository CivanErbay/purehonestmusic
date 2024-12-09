<template>
  <DefaultGrid :no-spacing="true">
    <div class="lg:col-start-3 lg:col-end-11">
      <div v-for="(group, date) in visibleGroupedItems" :key="date" class="mb-16">
        <p class="text-2xl font-semibold mb-6">
          <span :class="{ underline: weekDay(group[0].date) === 'Heute' }">{{ weekDay(group[0].date) }},</span>
          {{ date }}
        </p>
        <ItemsConcert v-for="item in group" :key="item.slug" class="lg:col-start-3 lg:col-end-11" :item="item" />
      </div>
      <div v-if="showMoreButton" class="flex justify-center">
        <button @click="showMoreDays" class="btn" :class="{
          'opacity-50 pointer-events-none':
            totalVisibleConcerts >= totalConcerts,
        }">
          Mehr Konzerte anzeigen
        </button>
      </div>

      <div class="flex justify-center mt-2 text-gray-400 mb-16">
        <p class="text-sm">
          {{ totalVisibleConcerts }} von {{ items.length }} Konzerten
        </p>
      </div>
    </div>
  </DefaultGrid>
</template>
<script setup>
const { items } = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

console.log(items)

const groupedItems = computed(() => {
  return items.reduce((groups, item) => {
    const dateKey = formattedDate(item.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {});
});

const maxDays = ref(3);
const showMoreButton = computed(
  () => totalVisibleConcerts.value < items.length
);

const visibleGroupedItems = computed(() => {
  const groupedDates = Object.keys(groupedItems.value);
  return groupedDates.slice(0, maxDays.value).reduce((result, date) => {
    result[date] = groupedItems.value[date];
    return result;
  }, {});
});

const totalVisibleConcerts = computed(() => {
  return Object.values(visibleGroupedItems.value).flat().length;
});

const showMoreDays = () => {
  maxDays.value += 3;
};
</script>
