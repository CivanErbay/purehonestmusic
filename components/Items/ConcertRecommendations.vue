<template>
  <!--   <HighlightConcert :item="item"></HighlightConcert> -->

  <div
    data-hs-carousel='{
  "loadingClasses": "opacity-0",
  "dotsItemClasses": "hs-carousel-active:bg-blue-700 hs-carousel-active:border-blue-700 size-3 border border-gray-400 rounded-full cursor-pointer dark:border-neutral-600 dark:hs-carousel-active:bg-blue-500 dark:hs-carousel-active:border-blue-500",
  "slidesQty": {
    "xs": 1,
    "lg": 3
  }
}'
    class="relative"
  >
    <div class="hs-carousel w-full overflow-hidden bg-white">
      <div class="relative h-96 -mx-1">
        <!-- transition-transform duration-700 -->
        <div
          class="hs-carousel-body absolute top-0 bottom-0 start-0 flex flex-nowrap transition-transform duration-700 bg-[#131313]"
        >
          <div v-for="item in items" class="hs-carousel-slide px-1">
            <div class="flex justify-center h-full dark:bg-neutral-900">
              <HighlightConcert :item="item"></HighlightConcert>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="hidden lg:inline-flex hs-carousel-prev cursor-pointer hs-carousel-disabled:opacity-50 left-[-53px] hs-carousel-disabled:pointer-events-none absolute inset-y-0 justify-center items-center w-[46px] h-full text-gray-800 hover:bg-gray-800/10 focus:outline-none focus:bg-gray-800/10 rounded-s-lg dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
    >
      <span class="text-2xl" aria-hidden="true">
        <svg
          class="shrink-0 size-5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m15 18-6-6 6-6"></path>
        </svg>
      </span>
      <span class="sr-only">Previous</span>
    </button>
    <button
      type="button"
      class="hidden lg:inline-flex hs-carousel-next hs-carousel-disabled:opacity-50 right-[-53px] hs-carousel-disabled:pointer-events-none absolute inset-y-0 end-0 justify-center items-center w-[46px] h-full text-gray-800 hover:bg-gray-800/10 focus:outline-none focus:bg-gray-800/10 rounded-e-lg dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
    >
      <span class="sr-only">Next</span>
      <span class="text-2xl" aria-hidden="true">
        <svg
          class="shrink-0 size-5"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </span>
    </button>

    <div
      class="hs-carousel-pagination flex justify-center absolute -bottom-8 start-0 end-0 space-x-2"
    ></div>
  </div>
  <!-- End Slider -->
</template>

<script setup>
import HighlightConcert from './HighlightConcert.vue';

const { items } = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});
</script>

<style>
.hs-carousel-pagination span.active {
  background-color: #d9d9d9 !important;
  border-color: #d9d9d9 !important;
}
</style>
