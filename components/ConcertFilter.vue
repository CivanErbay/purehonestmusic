<template>
  <DefaultGrid :no-spacing="true">
    <div
      class="xl:col-start-3 xl:col-end-11 flex flex-col sm:flex-row sm:items-center mb-12"
    >
      <div class="text-2xl mr-12">Filter:</div>
      <div class="flex flex-wrap sm:items-center gap-2 sm:gap-4 my-6 relative">
        <!-- <ItemsDatepicker
          class="w-36"
          slug="date"
          :open="openDropdown === 'date'"
          :selected-date="filters.date"
          @update:date="handleDateChange"
          @update:toggle="handleDropdownToggle"
        /> -->
        <ItemsDropdown
          title="Location"
          class="font-medium"
          slug="venues"
          :items="filters.venues"
          :open="openDropdown === 'venues'"
          @update:selected-items="handleSelectedItem"
          @update:toggle="handleDropdownToggle"
        />
        <ItemsDropdown
          title="Musikgenre"
          class="font-medium"
          slug="genres"
          :items="filters.genres"
          :open="openDropdown === 'genres'"
          @update:selected-items="handleSelectedItem"
          @update:toggle="handleDropdownToggle"
        />
        <!-- <ItemsDropdown
          title="Veranstalter"
          class="font-medium "
          slug="promoters"
          :items="filters.promoters"
          :open="openDropdown === 'promoters'"
          @update:selected-items="handleSelectedItem"
          @update:toggle="handleDropdownToggle"
        /> -->
      </div>
      <div
        v-if="activeFilter"
        class="cleartBtn min-[320px]:text-center sm:ml-4"
        @click="handleClearFilter"
      >
        Filter zurücksetzen
      </div>
    </div>
  </DefaultGrid>
</template>

<script setup>
import { reactive, watch, ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  venues: {
    type: Array,
    default: () => [],
  },
  genres: {
    type: Array,
    default: () => [],
  },
  promoters: {
    type: Array,
    default: () => [],
  },
});

const route = useRoute();
const router = useRouter();

const openDropdown = ref(null);

const concertStore = useConcertStore();

const handleDropdownToggle = (dropdown) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown;
};

const filters = reactive({
  venues: [],
  genres: [],
  promoters: [],
});

const updateFilters = () => {
  filters.venues = props.venues
    .map(({ name, slug }) => ({
      name,
      slug,
      selected: route.query.venues
        ? route.query.venues.split(',').includes(slug)
        : false,
      count: concertStore.concerts.filter(
        (concert) => concert.venue?.slug === slug
      ).length,
    }))
    .filter((venue) => venue.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  filters.genres = props.genres
    .map(({ name }) => ({
      name: name,
      slug: name, // genres have no slug
      selected: route.query.genres
        ? route.query.genres.split(',').includes(name)
        : false,
      count: concertStore.concerts.filter(
        (concert) => concert.genres.some((it) => it.name === name) // TODO check
      ).length,
    }))
    .filter((genre) => genre.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  filters.promoters = props.promoters
    .map(({ name, slug }) => ({
      name,
      slug,
      selected: route.query.promoters
        ? route.query.promoters.split(',').includes(slug)
        : false,
      count: concertStore.concerts.filter(
        (concert) => concert.promoter?.slug === slug
      ).length,
    }))
    .filter((prom) => prom.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
};

watch(
  () => [props.venues, props.genres, props.promoters, concertStore.concerts],
  updateFilters,
  { immediate: true }
);

const activeFilter = computed(
  () =>
    route.query.venues ||
    route.query.genres ||
    route.query.promoters ||
    route.query.date
);

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

const handleDateChange = (date) => {
  const query = { ...route.query };

  if (date) {
    const formattedDate = new Date(date).toISOString();
    filters.date = formattedDate.split('T')[0];
    query.date = formattedDate.split('T')[0];
  } else {
    filters.date = null;
    delete query.date;
  }

  router.push({ query });
};

watch(
  () => route.query.date,
  (newDate) => {
    filters.date = newDate || null;
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

const handleClearFilter = () => {
  router.push({ query: {} });
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

<style scoped>
.cleartBtn {
  padding: 19px;
  border: 0.5px;
  border-top-style: none;
  border-right-style: none;
  border-bottom-style: none;
  border-left-style: none;
  border-style: solid;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem 1rem 1.5rem;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: #fff;
}

.cleartBtn:hover {
  background-color: #e0e0e0;
  color: #000;
}
</style>
