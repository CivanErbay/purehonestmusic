<template>
  <Recommendations
    v-if="items.length"
    :items="excludeSlug ? items.filter(i => i?.slug !== excludeSlug) : items"
    :headline="headline || 'Unsere\n  Konzertempfehlungen'"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  headline: { type: String, default: '' },
  excludeSlug: { type: String, default: '' },
})

const { data: landing } = await useLanding()
const items = computed(() => landing.value?.highlightedConcerts ?? [])
</script>
