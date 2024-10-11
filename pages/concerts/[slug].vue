<template>
  <div>
    <h2>{{ concert.artistName }}</h2>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const { concert, status } = await useFetchConcert(route.params.slug);
</script>
