<template>
  <div class="">
    <ItemList :items="filteredItems" />
    <div
      v-if="beforeDateFilteredConcerts.length > filteredItems.length"
      class="flex justify-center"
    >
      <button
        @click="concertStore.showMoreConcerts"
        class="btn"
        :class="{
          'opacity-50 pointer-events-none':
            filteredItems.length >= concertStore.totalConcerts,
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

  // show only concerts from today on
  let items = beforeDateFilteredConcerts.value.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= today;
  });

  // show only concerts from selected date
  if (selectedDate) {
    return items.value.filter((item) => {
      const itemDate = new Date(item.date);

      const newItemDate = new Date(itemDate).toISOString().split('T')[0];
      return newItemDate === selectedDate;
    });
  }

  // show all items if less than 7
  if (items.length < 7) {
    return items;
  }

  // check maxDate if more than 7 items, but always show at least 7
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + concertStore.showUntilDaysFromNow);
  maxDate.setHours(0, 0, 0, 0);

  let count = 0;
  return items.filter((item) => {
    const itemDate = new Date(item.date);
    count++;
    return itemDate <= maxDate || count <= 7;
  });
});

// this checks that we always show some concerts when clicking on show more
watch(
  [() => concertStore.showUntilDaysFromNow, () => filteredItems.value.length],
  async (newVal, oldVal) => {
    if (
      newVal[0] >= oldVal[0] &&
      newVal[1] === oldVal[1] &&
      beforeDateFilteredConcerts.value.length !== newVal[1]
    ) {
      concertStore.showMoreConcerts();
    }
  }
);
</script>

<style lang="scss" scoped></style>
