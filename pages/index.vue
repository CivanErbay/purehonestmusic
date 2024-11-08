<template>
  <div class="w-full">
    <Hero />
    <Recommendations :items="concerts" />
    <ItemList :searchQuery="searchQuery" :items="concerts" />
  </div>
</template>

<script setup>


const { concerts } = await useFetchConcerts();

const searchQuery = useState('searchQuery');
</script>
