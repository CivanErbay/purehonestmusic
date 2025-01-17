<template>
  <ItemList :items="filteredItems" />
  <div class="flex justify-center mt-2 text-gray-400 mb-16">
    <p class="text-sm">
      {{ filteredItems.length }} von
      {{ concertStore.totalConcertCount }} Konzerten
    </p>
  </div>
  <div
    v-if="filteredItems.length < concertStore.totalConcertCount"
    class="flex justify-center"
  >
    <button
      @click="showMoreConcerts"
      class="btn"
      :class="{
        'opacity-50 pointer-events-none':
          filteredItems.length >= concertStore.totalConcertCount,
      }"
    >
      Mehr Konzerte anzeigen
    </button>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const concertStore = useConcertStore();

const route = useRoute();

const filteredItems = computed(() => {
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

  const selectedDate = route.query.date;

  const sortedItems = concertStore.concerts.value
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .filter((item) => {
      const itemDate = new Date(item.date);
      if (selectedDate) {
        const newItemDate = new Date(itemDate).toISOString().split('T')[0];
        return newItemDate === selectedDate;
      }
      return itemDate >= today;
    });

  // const thresholdDate =
  //   sortedItems[concertStore.displayConcertsCount - 1]?.date;
  // const thresholdItems = sortedItems.filter(
  //   (item) => item.date === thresholdDate
  // );

  return sortedItems
    .filter((item, index, self) => self.indexOf(item) === index)
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
    .slice(0, concertStore.displayConcertsCount);
  // .concat(thresholdItems);
});

const showMoreConcerts = async () => {
  concertStore.setDisplayConcertsCount(concertStore.displayConcertsCount + 20);
};
</script>

<style lang="scss" scoped></style>
