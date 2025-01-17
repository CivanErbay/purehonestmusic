<template>
  <div class="w-full">
    <Hero
      :media="landing.media"
      :title="landing.title"
      :subtitle="landing.subtitle"
    />
    <br />
    <br />
    <ConcertFilter :venues="venues" :genres="genres" :promoters="promoters" />
    <FilteredItemList />

    <Recommendations
      :items="landing.highlightedConcerts"
      headline="Unsere
        Konzertempfehlungen"
    />
    <!--<Recommendations
      v-if="
        landing.genreConcerts1 && landing.genreConcerts1.concerts.length > 2
      "
      :items="landing.genreConcerts1.concerts"
      :headline="`Top Konzerte aus dem Genre: ${landing.genreConcerts1.genre.name}`"
    />
    <Recommendations
      v-if="
        landing.genreConcerts2 && landing.genreConcerts2.concerts.length > 2
      "
      :items="landing.genreConcerts2.concerts"
      :headline="`Top Konzerte aus dem Genre: ${landing.genreConcerts2.genre.name}`"
    />-->
    <AboutBox />
  </div>
</template>

<script setup>
const concertStore = useConcertStore();
concertStore.loadConcerts();

const venuesPromise = fetchCollectionHandler('venues');
const genresPromise = fetchCollectionHandler('genres');
const promotersPromise = fetchCollectionHandler('promoters');
const landingPromise = fetchGlobalHandler('landing');

const { data: venues } = await venuesPromise;
const { data: genres } = await genresPromise;
const { data: promoters } = await promotersPromise;
const { data: landing } = await landingPromise;

// console.log({ concerts, venues, genres, promoters, landing });
</script>
