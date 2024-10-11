<template>
  <div class="w-full">
    <Hero />
    <ItemList :searchQuery="searchQuery" :items="concerts" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const { concerts, status } = await useFetchConcerts();

const searchQuery = ref('');

const updateSearchQuery = (newQuery) => {
  searchQuery.value = newQuery;
};
</script>
