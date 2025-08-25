<template>
  <div class="relative">
    <Swiper
      class="w-full"
      @swiper="onSwiper"
      :modules="modules"
      :loop="normalizedItems.length > 3"
      :speed="500"
      :spaceBetween="spaceBetween"
      :breakpoints="breakpoints"
      :pagination="{ el: '.concert-slider__pagination', type: 'bullets', clickable: true }"
    >
      <SwiperSlide
        v-for="item in normalizedItems"
        :key="item?.id || item?.slug"
      >
        <div class="h-[420px] overflow-hidden lg:h-auto">
          <!-- WICHTIG: stabiler Link via named route (Fallback: absolute URL) -->
          <NuxtLink :to="linkTo(item)" class="block h-full no-inner-links">
            <HighlightConcert :item="item" class="h-full flex flex-col" />
          </NuxtLink>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>

  <div class="mt-4 flex justify-center">
    <div class="concert-slider__pagination"></div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import HighlightConcert from '~/components/Items/HighlightConcert.vue'

const props = defineProps({
  items: { type: Array, required: true, default: () => [] },
})

const modules = [Pagination, Navigation]
const swiperInstance = ref(null)
const onSwiper = (s) => (swiperInstance.value = s)

const slideNext = () => swiperInstance.value?.slideNext()
const slidePrev = () => swiperInstance.value?.slidePrev()
defineExpose({ slideNext, slidePrev })

const spaceBetween = 24
const breakpoints = {
  0:    { slidesPerView: 1.1, spaceBetween: 16 },
  640:  { slidesPerView: 2,   spaceBetween: 20 },
  1024: { slidesPerView: 3,   spaceBetween },
}

/**
 * Normalisierung der Items:
 * - Setzt `item.to` = named route für pages/concerts/[slug].vue
 * - Setzt `item.href` = absoluter Fallback '/concerts/<slug>'
 * - Lässt vorhandene Felder unberührt
 */
const normalizedItems = computed(() =>
  (props.items ?? []).map((i) => {
    const slug = i?.slug
    const to =
      i?.to ??
      (slug ? { name: 'concerts-slug', params: { slug } } : null)
    const href =
      i?.href ??
      (slug ? `/concerts/${slug}` : '/')
    return { ...i, to, href }
  })
)

/** Bevorzugt named route, sonst absoluter Fallback */
const linkTo = (item) => item.to ?? item.href ?? '/'
</script>

<style>
.concert-slider__pagination {
  position: static !important;
  display: inline-flex !important;
  gap: 8px;
  width: auto !important;
}
.concert-slider__pagination .swiper-pagination-bullet-active {
  background-color: #e77000 !important;
  width: 20px !important;
  height: 8px;
  border-radius: 8px;
}
.concert-slider__pagination .swiper-pagination-bullet {
  background-color: #000;
  width: 8px;
  height: 8px;
  border-radius: 99999px !important;
  transition: all 0.3s ease;
}

/* Optional: verhindert verschachtelte Links, falls der Teaser intern <a> rendert */
.no-inner-links :is(a, [role="link"]) {
  pointer-events: none;
}
</style>
