<template>
  <div class="w-full">
    <Hero />
    <Recommendations :items="concerts" headline="Unsere
        Konzertempfehlungen" />
    <ItemList :searchQuery="searchQuery" :items="concerts" />
    <Recommendations :items="concerts" headline="Top Konzerte aus dem Genre: Alternative" />
    <Recommendations :items="concerts" headline="Top Konzerte aus dem Genre: Post Punk" />
    <AboutBox />
  </div>
</template>

<script setup>
const [concerts, venues, genres] = await Promise.all([
  fetchCollectionHandler('concerts'),
  fetchCollectionHandler('venues'),
  fetchCollectionHandler('genres'),
]).then((responses) => responses.map((response) => response.data));

console.log({ concerts, venues, genres });

const searchQuery = useState('searchQuery');
</script>
