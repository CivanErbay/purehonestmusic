<template>
  <DefaultGrid>
    <!-- Headline -->
    <div class="xl:col-start-2 xl:col-end-12 col-span-12 mt-5 xl:mt-10">
      <h4 class="text-2xl font-semibold mb-6">
        {{ headline || 'Unsere Konzertempfehlungen' }}
      </h4>
    </div>

    <!-- Row: Linker Pfeil in Spalte 1 (horizontal MITTIG), vertikal mittig zur Slider-Reihe -->
    <div class="hidden xl:flex xl:col-start-1 xl:col-end-2 items-center justify-center z-10">
      <button
        v-if="items.length > 3"
        class="arrow"
        type="button"
        aria-label="Vorheriger Slide"
        @click="sliderRef?.slidePrev()"
      >
        <svg class="shrink-0 size-10" xmlns="http://www.w3.org/2000/svg" width="48" height="48"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </button>
    </div>

    <!-- Slider in Spalten 2–11 (grid line 2 / 12) -->
    <div class="xl:col-start-2 xl:col-end-12 col-span-12 relative">
      <ClientOnly>
        <ConcertSlider ref="sliderRef" :items="items" />
      </ClientOnly>
    </div>

    <!-- Row: Rechter Pfeil in Spalte 12 (horizontal MITTIG), vertikal mittig -->
    <div class="hidden xl:flex xl:col-start-12 xl:col-end-13 items-center justify-center z-10">
      <button
        v-if="items.length > 3"
        class="arrow"
        type="button"
        aria-label="Nächster Slide"
        @click="sliderRef?.slideNext()"
      >
        <svg class="shrink-0 size-10" xmlns="http://www.w3.org/2000/svg" width="48" height="48"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </button>
    </div>
  </DefaultGrid>
</template>

<script setup>
import { ref } from 'vue';
import ConcertSlider from '~/components/Items/ConcertSlider.vue';

const sliderRef = ref(null);

const { items, headline } = defineProps({
  items: { type: Array, required: true, default: () => [] },
  headline: { type: String, required: false, default: '' }
});
</script>

<style scoped>
.arrow { transition: color .3s ease; color: inherit; }
.arrow:hover { color: #d1d1d1; }
.arrow svg { opacity: .6; transition: opacity .3s ease; }
.arrow:hover svg { opacity: 1; }
</style>
