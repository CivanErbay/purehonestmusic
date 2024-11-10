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
  venues: props.venues.map(({ name, slug }) => ({
    name,
    slug,
    selected: route.query.venues
      ? route.query.venues.split(',').includes(slug)
      : false,
  })),
  genres: props.genres.map(({ name, slug }) => ({
    name: name,
    slug: name, // genres have no slug
    selected: route.query.genres
      ? route.query.genres.split(',').includes(slug)
      : false,
  })),
  promoters: props.promoters.map(({ name, slug }) => ({
    name,
    slug,
    selected: route.query.promoters
      ? route.query.promoters.split(',').includes(slug)
      : false,
  })),
});

watch(
  () => route.query,
  (newQuery) => {
    filters.venues.forEach((venue) => {
      venue.selected = newQuery.venues
        ? newQuery.venues.split(',').includes(venue.slug)
        : false;
    });
    filters.genres.forEach((genre) => {
      genre.selected = newQuery.genres
        ? newQuery.genres.split(',').includes(genre.name)
        : false;
    });
    filters.promoters.forEach((promoter) => {
      promoter.selected = newQuery.promoters
        ? newQuery.promoters.split(',').includes(promoter.slug)
        : false;
    });
  }
);
const handleSelectedItem = (category, selectedItem) => {
  const query = { ...route.query };
  const selectedItems = query[category] ? query[category].split(',') : [];

  if (selectedItems.includes(selectedItem.slug)) {
    const index = selectedItems.indexOf(selectedItem.slug);
    selectedItems.splice(index, 1);
  } else {
    selectedItems.push(selectedItem.slug);
  }

  if (selectedItems.length > 0) {
    query[category] = selectedItems.join(',');
  } else {
    delete query[category];
  }

  router.push({ query });
};
</script>

<style lang="scss" scoped></style>
