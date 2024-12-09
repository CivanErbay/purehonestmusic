<template>
  <ItemList :items="filteredItems" />
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

  return items
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
      if (selectedDate) {
        const newItemDate = new Date(itemDate).toISOString().split('T')[0];
        return newItemDate === selectedDate;
      }
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
});
</script>

<style lang="scss" scoped></style>
