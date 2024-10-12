<template>
  <div class="w-full">
    <Hero />
    <ItemList :searchQuery="searchQuery" :items="concerts" />
  </div>
</template>

<script setup>


const { concerts } = await useFetchConcerts();

const searchQuery = useState('searchQuery');
</script>
