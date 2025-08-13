<template>
  <div>
    <!-- Promoter-Infos -->
    <DefaultGrid :no-spacing="true" class="mt-5 lg:mt-10 mb-8">
      <!-- Wrapper ist das Grid-Item: ab lg über alle 12 Spalten, <xl ohnehin 1-spaltig = volle Breite -->
      <div class="lg:col-start-1 lg:col-end-[-1] w-full">
        <AtomContentCard
          :item="promoterData"
          class="w-full block max-w-none"
        />
      </div>

      <h2 class="text-3xl mt-8 lg:mt-16 lg:col-start-2 lg:col-end-[-1]">
        Bevorstehende {{ promoterData.name }} Konzerte: <br>
      </h2>
    </DefaultGrid>

    <!-- Bevorstehende Konzerte -->
    <ItemList :items="upcomingConcerts" />

    <!-- Vergangene Konzerte -->
    <div v-if="pastConcerts.length">
      <DefaultGrid :no-spacing="true" class="mt-10 mb-4">
        <h3 class="text-3xl lg:col-start-2 lg:col-end-[-1] mb-4">
          Vergangene {{ promoterData.name }} Konzerte:
        </h3>
      </DefaultGrid>
      <ItemList :items="pastConcerts" :hideDateHeaders="true" />
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

// Promoter-Daten laden
const { data } = await fetchCollectionHandler('promoters', route.params.slug);

const { data: promoterData } = useLivePreview({
  initialData: data.value,
  serverURL: import.meta.env.VITE_API_ENDPOINT,
  depth: 2,
});

// Konzerte abrufen
const { data: rawConcerts } = await fetchCollectionHandler(
  'concerts',
  null,
  1000,
  0,
  { where: { promoter: { equals: promoterData.value.id } } }
);

// Aktuelles Datum ermitteln
const now = new Date();

// Kommende Konzerte sortiert aufsteigend
const upcomingConcerts = rawConcerts.value
  .filter((concert) => new Date(concert.date) >= now)
  .sort((a, b) => new Date(a.date) - new Date(b.date));

// Vergangene Konzerte sortiert absteigend
const pastConcerts = rawConcerts.value
  .filter((concert) => new Date(concert.date) < now)
  .sort((a, b) => new Date(b.date) - new Date(a.date));
</script>
<style>
h2 {
  font-size: 5 rem
};
</style>