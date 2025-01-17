<template>
  <div class="w-full">
    <Hero
      :media="landing.media"
      :title="landing.title"
      :subtitle="landing.subtitle"
    />
    <br />
    <br />
    <ConcertFilter />
    <FilteredItemList />

    <Recommendations
      :items="landing.highlightedConcerts"
      headline="Unsere
        Konzertempfehlungen"
    />
    <AboutBox />
  </div>
</template>

<script setup>
const concertStore = useConcertStore();

const [_, landingResponse] = await Promise.all([
  concertStore.fetchAllData(),
  fetchGlobalHandler('landing'),
]);

const { data: landing } = landingResponse;
</script>
