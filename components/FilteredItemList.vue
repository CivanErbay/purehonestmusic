<template>
  <div class="">
    <ItemList :items="filteredItems" />
    <div
      v-if="concertStore.totalConcerts > filteredItems.length"
      class="flex justify-center"
    >
      <button
        @click="concertStore.showMoreConcerts"
        class="btn"
        :class="{
          'opacity-50 pointer-events-none':
            totalVisibleConcerts >= concertStore.totalConcerts,
        }"
      >
        Mehr Konzerte anzeigen
      </button>
    </div>

    <div class="flex justify-center mt-2 text-gray-400 mb-16">
      <p class="text-sm">
        {{ filteredItems.length }} von
        {{ beforeDateFilteredConcerts.length }} Konzerten
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const concertStore = useConcertStore();

const route = useRoute();

const beforeDateFilteredConcerts = computed(() => {
  // const query = route.query.q ? route.query.q.toLowerCase() : '';
  const selectedVenues = route.query.venues
    ? route.query.venues.split(',')
    : [];
  const selectedPromoters = route.query.promoters
    ? route.query.promoters.split(',')
    : [];
  const selectedGenres = route.query.genres
    ? route.query.genres.split(',')
    : [];

  return concertStore.concerts.filter((item) => {
    const venueMatch =
      selectedVenues.length === 0 || selectedVenues.includes(item.venue?.slug);
    const promoterMatch =
      selectedPromoters.length === 0 ||
      selectedPromoters.includes(item.promoter?.slug);
    const genreMatch =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) =>
        item.genres.map((g) => g.name).includes(genre)
      );
    return venueMatch && promoterMatch && genreMatch;
  });

  // .sort((a, b) => new Date(a.date) - new Date(b.date));
});

const filteredItems = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = route.query.date;

  return beforeDateFilteredConcerts.value.filter((item) => {
    const itemDate = new Date(item.date);
    if (selectedDate) {
      const newItemDate = new Date(itemDate).toISOString().split('T')[0];
      return newItemDate === selectedDate;
    }
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + concertStore.showUntilDaysFromNow);
    maxDate.setHours(0, 0, 0, 0);

    // we won't enforce a date filter if there are no more than 7 concerts
    if (beforeDateFilteredConcerts.value.length > 7 && itemDate > maxDate) {
      return false;
    }
    return itemDate >= today;
  });
});
</script>

<style lang="scss" scoped></style>
