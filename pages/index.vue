<template>
  <div v-if="dataLoaded" class="w-full">
    <Hero
      :media="landing.media"
      :title="landing.title"
      :subtitle="landing.subtitle"
    />
    <br />
    <br />
    <ConcertFilter
      :venues="venues"
      :genres="genres"
      :promoters="promoters"
      :concerts="concerts"
    />
    <FilteredItemList :items="concerts" />

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
const dataLoaded = ref(false);
const [concerts, venues, genres, promoters, landing] = await Promise.all([
  fetchCollectionHandler('concerts', null, 1000, 0, {
    sort: 'date',
    where: {
      date: {
        greater_than: new Date(new Date().setHours(0, 0, 0, 0)).toISOString(),
      },
    },
  }),
  fetchCollectionHandler('venues'),
  fetchCollectionHandler('genres'),
  fetchCollectionHandler('promoters'),
  fetchGlobalHandler('landing'),
]).then((responses) => {
  dataLoaded.value = true;
  return responses.map((response) => response.data);
});

// console.log({ concerts, venues, genres, promoters, landing });
</script>
