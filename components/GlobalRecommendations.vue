<template>
  <Recommendations
    v-if="itemsForSlider.length"
    :items="itemsForSlider"
    :headline="headline || 'Unsere\n  Konzertempfehlungen'"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  headline: { type: String, default: '' },
  excludeSlug: { type: String, default: '' },
})

// Landing laden (aus dem Cache via useLanding)
const { data: landing } = await useLanding()

/**
 * Wir normalisieren die Items und geben jedem Item ein Feld `to`,
 * das ein NAMED ROUTE Objekt enthält. So kann der Slider (oder die
 * Karte darin) dieses Feld direkt an <NuxtLink :to="..."> übergeben.
 *
 * Vorteil: robust gegen doppelte "concerts/concerts", Base-Path, i18n etc.
 */
const itemsForSlider = computed(() => {
  const raw = landing.value?.highlightedConcerts ?? []
  const filtered = props.excludeSlug
    ? raw.filter(i => i?.slug !== props.excludeSlug)
    : raw

  return filtered.map(i => ({
    ...i,
    // Primärer, stabiler Link: named route für pages/concerts/[slug].vue
    to: { name: 'concerts-slug', params: { slug: i.slug } },
    // Optionaler Fallback, falls irgendwo absolute Pfade erwartet werden:
    href: `/concerts/${i.slug}`,
  }))
})
</script>
