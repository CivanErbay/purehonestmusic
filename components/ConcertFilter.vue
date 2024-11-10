<template>
  <DefaultGrid :no-spacing="true">
    <div class="flex items-center gap-4 my-6 lg:col-start-3 lg:col-end-11">
      <div class="text-2xl">Filter:</div>
      <ItemsDropdown
        title="Location"
        :items="filters.venues"
        @update:selected-items="handleSelectedItem('venues', $event)"
      />
      <ItemsDropdown
        title="Genre"
        :items="filters.genres"
        @update:selected-items="handleSelectedItem('genres', $event)"
      />
      <ItemsDropdown
        title="Veranstaler"
        :items="filters.promoters"
        @update:selected-items="handleSelectedItem('promoters', $event)"
      />
    </div>
  </DefaultGrid>
</template>

<script setup>
import { reactive, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({ venues: Array, genres: Array, promoters: Array });
console.log(props);

const route = useRoute();
const router = useRouter();

const filters = reactive({
  venues: props.venues.map((venue) => ({
    name: venue.name,
    selected: route.query.venues
      ? route.query.venues.split(',').includes(venue)
      : false,
  })),
  genres: props.genres.map((genre) => ({
    name: genre.name,
    selected: route.query.genres
      ? route.query.genres.split(',').includes(genre)
      : false,
  })),
  promoters: props.promoters.map((promoter) => ({
    name: promoter.name,
    selected: route.query.promoters
      ? route.query.promoters.split(',').includes(promoter)
      : false,
  })),
});

watch(
  () => route.query,
  (newQuery) => {
    filters.venues.forEach((venue) => {
      venue.selected = newQuery.venues
        ? newQuery.venues.split(',').includes(venue.name)
        : false;
    });
    filters.genres.forEach((genre) => {
      genre.selected = newQuery.genres
        ? newQuery.genres.split(',').includes(genre.name)
        : false;
    });
    filters.promoters.forEach((promoter) => {
      promoter.selected = newQuery.promoters
        ? newQuery.promoters.split(',').includes(promoter.name)
        : false;
    });
  }
);

const handleSelectedItem = (category, selectedItems) => {
  const query = { ...route.query };
  query[category] = selectedItems.map((item) => item.name).join(',');
  router.push({ query });
};
</script>

<style lang="scss" scoped></style>
