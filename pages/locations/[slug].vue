<template>
  <div>
    <DefaultGrid :no-spacing="true" class="mt-5 lg:mt-10 mb-8">
      <AtomContentCard
        class="lg:col-start-3 lg:col-end-11"
        :item="venueData"
        @toggleFavorite="toggleFavoriteLocation"
      />
    </DefaultGrid>
    <!-- TODO fit headline in grid -->
    <h3 class="text-3xl">Konzerte in {{ venueData.name }}</h3>
    <ItemList :items="concerts" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const { data: venueData } = await fetchCollectionHandler(
  'venues',
  route.params.slug
);

const { data: concerts } = await fetchCollectionHandler(
  'concerts',
  null,
  1000,
  0,
  { where: { venue: { equals: venueData.value.id } } }
);

const usersStore = useUsersStore();
const { isLocationFavorite, toggleFavoriteLocation, user } = usersStore;

watch(user.favoriteLocations, () => {
  venueData.value.isUserFavorite = isLocationFavorite(venueData.value.id);
});

onMounted(() => {
  venueData.value.isUserFavorite = isLocationFavorite(venueData.value.id);
});
</script>
