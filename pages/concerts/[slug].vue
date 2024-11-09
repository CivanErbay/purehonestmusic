<template>
  <div>
    <h2>{{ concert.artistName }}</h2>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const { data: concert } = await fetchCollectionHandler(
  'concerts',
  route.params.slug
);
</script>
