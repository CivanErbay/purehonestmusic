<template>
  <div class="relative">
    <Swiper
      class="w-full"
      @swiper="onSwiper"
      :modules="modules"
      :loop="items.length > 3"
      :speed="500"
      :spaceBetween="spaceBetween"
      :breakpoints="breakpoints"
      :pagination="{ el: '.concert-slider__pagination', type: 'bullets', clickable: true }"
    >
      <SwiperSlide v-for="item in items" :key="item.id">
        <div class="h-[420px] overflow-hidden lg:h-auto">
          <HighlightConcert :item="item" class="h-full flex flex-col" />
        </div>
      </SwiperSlide>
    </Swiper>
  </div>

  <div class="mt-4 flex justify-center">
    <div class="concert-slider__pagination"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import HighlightConcert from '~/components/Items/HighlightConcert.vue';

const { items } = defineProps({
  items: { type: Array, required: true, default: () => [] },
});

const modules = [Pagination, Navigation];
const swiperInstance = ref(null);
const onSwiper = (s) => (swiperInstance.value = s);

const slideNext = () => swiperInstance.value?.slideNext();
const slidePrev = () => swiperInstance.value?.slidePrev();
defineExpose({ slideNext, slidePrev });

const spaceBetween = 24;
const breakpoints = {
  0:    { slidesPerView: 1.1, spaceBetween: 16 },
  640:  { slidesPerView: 2,   spaceBetween: 20 },
  1024: { slidesPerView: 3,   spaceBetween }
};
</script>

<style>
.concert-slider__pagination { position: static !important; display: inline-flex !important; gap: 8px; width: auto !important; }
.concert-slider__pagination .swiper-pagination-bullet-active { background-color: #e77000 !important; width: 20px !important; height: 8px; border-radius: 8px; }
.concert-slider__pagination .swiper-pagination-bullet { background-color: #000; width: 8px; height: 8px; border-radius: 99999px !important; transition: all 0.3s ease; }
</style>
