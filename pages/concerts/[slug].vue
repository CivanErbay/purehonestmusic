<template>
  <div>
    <h2>{{ concert.name }}</h2>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const { data: concert } = await fetchCollectionHandler(
  'concerts',
  route.params.slug
);
console.log(concert);
</script>
