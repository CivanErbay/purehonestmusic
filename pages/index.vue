<template>
  <div class="w-full">
    <Hero />
    <ItemList :searchQuery="searchQuery" :items="concerts" />
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
