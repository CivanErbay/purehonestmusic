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
console.log({ concerts });

const searchQuery = ref('');

const updateSearchQuery = (newQuery) => {
  searchQuery.value = newQuery;
};

async function fetchConcerts() {
  try {
    const response = await fetch('http://localhost:3000/api/concerts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

fetchConcerts();
</script>
