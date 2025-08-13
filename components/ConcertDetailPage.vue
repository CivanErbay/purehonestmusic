<template>
  <DefaultGrid
    :no-spacing="true"
    class="mb-5 mt-5 xl:mt-10 gap-x-4 xl:gap-x-6"
  >
    <!-- LINKS BÜNDIG: von xl:col-start-3 auf xl:col-start-1, mr entfernt -->
    <AtomContentCard
      class="xl:col-start-1 xl:col-end-10"
      :item="item"
    />

    <!-- RECHTS BÜNDIG (wie schon bei dir funktionierend) -->
    <AtomArtistCard
      v-if="artist"
      :artist="artist"
      class="xl:col-start-10 xl:col-end-[-1]"
    />
  </DefaultGrid>
</template>

<script setup>
const props = defineProps({ item: Object });

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
