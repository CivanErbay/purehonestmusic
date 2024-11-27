<template>
  <div class="w-full hyphenated-text">
    <Hero />
    <Recommendations :items="concerts" headline="Unsere
        Konzertempfehlungen" />
    <ItemsCarousel></ItemsCarousel>
    <ConcertFilter :venues="venues" :genres="genres" :promoters="promoters" :concerts="concerts" />
    <ItemList :items="concerts" />
    <Recommendations :items="concerts" headline="Top Konzerte aus dem Genre: Alternative" />
    <Recommendations :items="concerts" headline="Top Konzerte aus dem Genre: Post Punk" />
    <AboutBox />
  </div>
</template>

<script setup>
const [concerts, venues, genres, promoters] = await Promise.all([
  fetchCollectionHandler('concerts'),
  fetchCollectionHandler('venues'),
  fetchCollectionHandler('genres'),
  fetchCollectionHandler('promoters'),
]).then((responses) => responses.map((response) => response.data));

// console.log({ concerts, venues, genres, promoters });
</script>
