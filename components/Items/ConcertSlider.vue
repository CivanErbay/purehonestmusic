<template>
  <swiper
    class="lg:h-[95%]"
    ref="swiperRef"
    @swiper="onSwiper"
    :loop="true"
    :modules="modules"
    :spaceBetween="30"
    :pagination="{
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true // Aktiviert die Klickbarkeit der Bulletpoints
    }"
    :breakpoints="{
      768: {
        slidesPerView: 3,
      },
    }"
    :speed="500"
    @swiperprogress="onProgress"
    @swiperslidechange="onSlideChange"
  >
    <swiper-slide v-for="item in items">
      <HighlightConcert :item="item"></HighlightConcert>
    </swiper-slide>
    <div class="swiper-pagination"></div>
  </swiper>

  <!-- Arrows werden nur angezeigt, wenn mehr als 3 Items vorhanden sind -->
  <button
    v-if="items.length > 3"
    class="hidden lg:block absolute left-[12%] top-[55%]"
    type="button"
    @click="swiperPrevSlide"
  >
    <svg
      class="shrink-0 size-10 opacity-60"
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m15 18-6-6 6-6"></path>
    </svg>
  </button>
  <button
    v-if="items.length > 3"
    class="hidden lg:block absolute right-[12%] top-[55%]"
    type="button"
    @click="swiperNextSlide"
  >
    <svg
      class="shrink-0 size-10 opacity-60"
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m9 18 6-6-6-6"></path>
    </svg>
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { register } from 'swiper/element/bundle';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
register();

import HighlightConcert from './HighlightConcert.vue';

const { items } = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const modules = [Pagination, Navigation];

const swiperInstance = ref();

function onSwiper(swiper) {
  swiperInstance.value = swiper;
}
const swiperNextSlide = () => {
  swiperInstance.value.slideNext();
};
const swiperPrevSlide = () => {
  swiperInstance.value.slidePrev();
};
</script>

<style>
.swiper-pagination-fraction,
.swiper-pagination-custom,
.swiper-horizontal>.swiper-pagination-bullets,
.swiper-pagination-bullets.swiper-pagination-horizontal {
  bottom: -6px;
  left: 0;
  width: 100%;
}

.swiper-pagination-bullet-active {
  background-color: #e77000 !important;
  width: 20px !important;
  height: 8px;
  border-radius: 8px;
  transition: all 0.3s ease; /* Smooth Transition für den aktiven Zustand */
}

.swiper-pagination-bullet {
  --swiper-pagination-bullet-border-radius: 0%; /* Überschreibt die Variable */
  background-color: #000; /* Ändert die Farbe der Bullets */
  width: 8px; /* Passt die Breite der Bullets an */
  height: 8px; /* Passt die Höhe der Bullets an */
  border-radius: 99999px !important;
  transition: all 0.3s ease; /* Smooth Transition für Bulletpoints */
}
</style>
