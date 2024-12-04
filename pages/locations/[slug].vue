<template>
  <DefaultGrid :no-spacing="true" class="mb-5 mt-5 lg:mt-10">
    <AtomContentCard
      class="lg:col-start-3 lg:col-end-11"
      :item="location"
      @toggleFavorite="toggleFavoriteLocation"
    />
  </DefaultGrid>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const { data } = await fetchCollectionHandler('venues', route.params.slug);
console.log(data);

const usersStore = useUsersStore();
const { isLocationFavorite, toggleFavoriteLocation } = usersStore;

const location = computed(() => {
  return { ...data.value, isUserFavorite: isLocationFavorite(data.value.id) };
});
</script>
