<template>
  <div>
    <ItemList :items="favoriteConcerts" />
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
