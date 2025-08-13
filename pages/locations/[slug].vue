<template>
  <div>
    <!-- Venue-Daten & Überschrift -->
    <DefaultGrid :no-spacing="true" class="mt-5 lg:mt-10 mb-8">
      <!-- Wrapper ist das Grid-Item: ab lg über alle 12 Spalten, <xl ohnehin 1-spaltig = volle Breite -->
      <div class="lg:col-start-1 lg:col-end-[-1] w-full">
        <AtomContentCard
          :item="venueData"
          @toggleFavorite="toggleFavoriteLocation"
          class="w-full block max-w-none"
        />
      </div>

      <!-- Überschrift ebenfalls über volle Breite ab lg -->
      <h3 class="text-3xl mt-8 lg:mt-16 lg:col-start-2 lg:col-end-[-1]">
        Konzerte im {{ venueData.name }}
      </h3>
    </DefaultGrid>

    <!-- Bevorstehende Konzerte -->
    <ItemList :items="upcomingConcerts" />

    <!-- Vergangene Konzerte -->
    <div v-if="pastConcerts.length">
      <DefaultGrid :no-spacing="true" class="mt-10 mb-4">
        <h3 class="text-3xl lg:col-start-2 lg:col-end-[-1] mb-4">
          Vergangene Konzerte im {{ venueData.name }}:
        </h3>
      </DefaultGrid>
      <ItemList :items="pastConcerts" :hideDateHeaders="true" />
    </div>
  </div>
</template>


<script setup>
import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';

const route = useRoute();

// Venue-Daten laden
const { data } = await fetchCollectionHandler('venues', route.params.slug);

const { data: venueData } = useLivePreview({
  initialData: data.value,
  serverURL: import.meta.env.VITE_API_ENDPOINT,
  depth: 2,
});

// Konzerte zur Location laden
const { data: concerts } = await fetchCollectionHandler(
  'concerts',
  null,
  1000,
  0,
  { where: { venue: { equals: venueData.value.id } } }
);

// Aktuelles Datum
const now = new Date();

// Kommende Konzerte (ab heute), sortiert aufsteigend
const upcomingConcerts = computed(() =>
  concerts.value
    .filter((concert) => new Date(concert.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
);

// Vergangene Konzerte, sortiert absteigend
const pastConcerts = computed(() =>
  concerts.value
    .filter((concert) => new Date(concert.date) < now)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
);

// Optional: Zugriff auf User Store
const usersStore = useUserStore();
</script>
