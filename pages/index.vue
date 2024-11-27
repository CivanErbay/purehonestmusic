<template>
  <div class="w-full">
    <Hero :media="landing.media" :title="landing.title" :subtitle="landing.subtitle" />
    <Recommendations :items="landing.highlightedConcerts" headline="Unsere
        Konzertempfehlungen" />
    <ItemsCarousel></ItemsCarousel>
    <ConcertFilter :venues="venues" :genres="genres" :promoters="promoters" :concerts="concerts" />
    <ItemList :items="concerts" />
    <Recommendations :items="landing.highlightedConcerts" headline="Top Konzerte aus dem Genre: Alternative" />
    <Recommendations :items="landing.highlightedConcerts" headline="Top Konzerte aus dem Genre: Post Punk" />
    <AboutBox />
  </div>
</template>

<script setup>
const [concerts, venues, genres, promoters, landing] = await Promise.all([
  fetchCollectionHandler('concerts'),
  fetchCollectionHandler('venues'),
  fetchCollectionHandler('genres'),
  fetchCollectionHandler('promoters'),
  fetchGlobalHandler('landing'),
]).then((responses) => responses.map((response) => response.data));

// console.log({ concerts, venues, genres, promoters, landing });
</script>
