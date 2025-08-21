<template>
  <DefaultGrid
    :no-spacing="true"
    class="mb-5 mt-5 xl:mt-10 gap-x-4 xl:gap-x-6"
  >
    <!-- LINKS: Concert groß – Spalten 2–9 (8 Spalten, linke Gutter frei) -->
    <div class="xl:col-start-2 xl:col-end-9 xl:self-start">
      <AtomContentCard :item="item" />
    </div>

    <!-- RECHTS: Artist klein – Spalten 10–12 (3 Spalten) -->
    <div class="xl:col-start-9 xl:col-end-12 xl:self-start">
      <AtomArtistCard
        v-if="artist"
        :artist="artist"
      />
    </div>
  </DefaultGrid>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ item: Object })

// Artist ermitteln + Hero-Fallback OHNE Props zu mutieren
const artist = computed(() => {
  const first = props.item?.artist?.[0]
  if (!first) return null
  return {
    ...first,
    heroImage: first.heroImage ?? props.item?.heroImage ?? null
  }
})
</script>
