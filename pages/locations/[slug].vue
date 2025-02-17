<template>
  <div>
    <DefaultGrid :no-spacing="true" class="mt-5 lg:mt-10 mb-8">
      <AtomContentCard
        class="lg:col-start-3 lg:col-end-11"
        :item="venueData"
        @toggleFavorite="toggleFavoriteLocation"
      />
      <h3 class="text-3xl mt-8 lg:mt-16 lg:col-start-3 lg:col-end-11">
        Konzerte in {{ venueData.name }}
      </h3>
    </DefaultGrid>
    <ItemList :items="sortedConcerts" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';

const route = useRoute();

const { data } = await fetchCollectionHandler('venues', route.params.slug);

const { data: venueData } = useLivePreview({
  initialData: data.value,
  serverURL: import.meta.env.VITE_API_ENDPOINT,
  depth: 2,
});

const { data: concerts } = await fetchCollectionHandler(
  'concerts',
  null,
  1000,
  0,
  { where: { venue: { equals: venueData.value.id } } }
);

const sortedConcerts = computed(() => {
  const now = new Date();
  return concerts.value
    .filter(concert => new Date(concert.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
});

const usersStore = useUserStore();
</script>