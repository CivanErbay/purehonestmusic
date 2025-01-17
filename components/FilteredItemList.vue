<template>
  <ItemList :items="filteredItems" />
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

  const beforeDateFilteredConcerts = concertStore.concerts.filter((item) => {
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

  // we won't enforce a date filter if there are no more than 7 concerts
  return beforeDateFilteredConcerts.filter((item) => {
    const itemDate = new Date(item.date);
    if (selectedDate) {
      const newItemDate = new Date(itemDate).toISOString().split('T')[0];
      return newItemDate === selectedDate;
    }
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + concertStore.showUntilDaysFromNow);
    maxDate.setHours(0, 0, 0, 0);

    if (beforeDateFilteredConcerts.length > 7 && itemDate > maxDate) {
      return false;
    }
    return itemDate >= today;
  });
  // .sort((a, b) => new Date(a.date) - new Date(b.date));
});
</script>

<style lang="scss" scoped></style>
