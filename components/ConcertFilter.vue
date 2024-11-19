<template>
  <DefaultGrid :no-spacing="true">
    <div
      class="lg:col-start-3 lg:col-end-11 flex flex-col sm:flex-row sm:items-center mb-12"
    >
      <div class="text-2xl mr-12">Filter:</div>
      <div class="flex flex-wrap sm:items-center gap-2 sm:gap-4 my-6 relative">
        <ItemsDropdown
          title="Location"
          slug="venues"
          :items="filters.venues"
          :open="openDropdown === 'venues'"
          @update:selected-items="handleSelectedItem"
          @update:toggle="handleDropdownToggle"
        />
        <ItemsDropdown
          title="Genre"
          slug="genres"
          :items="filters.genres"
          :open="openDropdown === 'genres'"
          @update:selected-items="handleSelectedItem"
          @update:toggle="handleDropdownToggle"
        />
        <ItemsDropdown
          title="Veranstaler"
          slug="promoters"
          :items="filters.promoters"
          :open="openDropdown === 'promoters'"
          @update:selected-items="handleSelectedItem"
          @update:toggle="handleDropdownToggle"
        />
      </div>
    </div>
  </DefaultGrid>
</template>

<script setup>
import { reactive, watch, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  venues: Array,
  genres: Array,
  promoters: Array,
  concerts: Array,
});

const route = useRoute();
const router = useRouter();

const openDropdown = ref(null);

const handleDropdownToggle = (dropdown) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown;
};

const filters = reactive({
  venues: props.venues.map(({ name, slug }) => ({
    name,
    slug,
    selected: route.query.venues
      ? route.query.venues.split(',').includes(slug)
      : false,
    count: props.concerts.filter((concert) => concert.venue?.slug === slug)
      .length,
  })),
  genres: props.genres.map(({ name }) => ({
    name: name,
    slug: name, // genres have no slug
    selected: route.query.genres
      ? route.query.genres.split(',').includes(name)
      : false,
    count: props.concerts.filter(
      (concert) => concert.genres.some((it) => it.name === name) // TODO check
    ).length,
  })),
  promoters: props.promoters.map(({ name, slug }) => ({
    name,
    slug,
    selected: route.query.promoters
      ? route.query.promoters.split(',').includes(slug)
      : false,
    count: props.concerts.filter((concert) => concert.promoter?.slug === slug)
      .length,
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

const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown')) {
    openDropdown.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
