<template>
  <DefaultGrid :no-spacing="true" class="mb-5 mt-5 xl:mt-10">
    <AtomContentCard
      class="xl:col-start-3 xl:col-end-9 xl:mr-4"
      :item="item"
      @toggleFavorite="toggleFavoriteConcert"
    />
    <AtomArtistCard
      v-if="artist"
      :artist="artist"
      class="xl:col-start-9 xl:col-end-11"
    />
  </DefaultGrid>
</template>

<script setup>
const props = defineProps({ item: Object });

const usersStore = useUserStore();
const { isConcertFavorite, toggleFavoriteConcert, user } = usersStore;

watch(user.favoriteConcerts, () => {
  props.item.isUserFavorite = isConcertFavorite(props.item.id);
});

onMounted(() => {
  props.item.isUserFavorite = isConcertFavorite(props.item.id);
});

const artist = computed(() => {
  if (props.item.artist.length === 0) {
    return null;
  }
  if (props.item.artist[0].heroImage === null) {
    props.item.artist[0].heroImage = props.item.heroImage;
  }
  return props.item.artist[0];
});
</script>
