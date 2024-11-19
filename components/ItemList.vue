<template>
  <DefaultGrid :no-spacing="true">
    <div class="lg:col-start-3 lg:col-end-11">
      <div
        v-for="(group, date) in visibleGroupedItems"
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
        />
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
import { useRoute } from 'vue-router';
const { items } = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const maxDays = ref(3);
const showMoreButton = ref(false);

const route = useRoute();

const filteredGroupedItems = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const query = route.query.q ? route.query.q.toLowerCase() : '';
  const selectedVenues = route.query.venues
    ? route.query.venues.split(',')
    : [];
  const selectedPromoters = route.query.promoters
    ? route.query.promoters.split(',')
    : [];
  const selectedGenres = route.query.genres
    ? route.query.genres.split(',')
    : [];

  const filteredItems = items
    .filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.venue?.address.city.toLowerCase().includes(query) ||
        item.venue?.name.toLowerCase().includes(query) ||
        item.promoter?.name.toLowerCase().includes(query) ||
        item.genres.some((genre) => genre.name?.toLowerCase().includes(query))
    )
    .filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= today;
    })
    .filter((item) => {
      const venueMatch =
        selectedVenues.length === 0 ||
        selectedVenues.includes(item.venue?.slug);
      const promoterMatch =
        selectedPromoters.length === 0 ||
        selectedPromoters.includes(item.promoter?.slug);
      const genreMatch =
        selectedGenres.length === 0 ||
        selectedGenres.some((genre) =>
          item.genres.map((g) => g.name).includes(genre)
        );
      return venueMatch && promoterMatch && genreMatch;
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
