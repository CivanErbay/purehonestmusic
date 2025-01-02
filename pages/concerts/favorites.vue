<template>
  <div>
    <DefaultGrid :no-spacing="true" class="text-2xl font-semibold mb-6">
      <h3 class="text-3xl mt-8 lg:mt-16 lg:col-start-3 lg:col-end-11">
        Deine Favoriten
      </h3>
    </DefaultGrid>
    <ItemList :items="favoriteConcerts"/>
  </div>
</template>

<script setup>
const { user } = useUserStore();
const { data: concerts } = await fetchCollectionHandler('concerts');

const favoriteConcerts = computed(() => {
  return concerts.value.filter((concert) =>
    user.favoriteConcerts.includes(concert.id)
  );
});
</script>

<style lang="scss" scoped></style>
