<template>
  <DefaultGrid :no-spacing="true" class="relative flex items-center">
    <div class="lg:col-start-1 lg:col-end-3 tracking-widest mt-6 lg:mt-0">
      <h1 class="text-lg">PURE.HONEST.MUSIC</h1>
      <h2 class="text-xs text-[#454545] w-max">ARTISTS / SHOWS / RECORDS</h2>
    </div>
    <div class="relative w-full lg:col-start-3 lg:col-end-11 my-5">
      <input
        v-model="localSearchQuery"
        type="search"
        id="search-dropdown"
        class="block p-4 w-full z-20 text-sm rounded text-gray-900 bg-[#D3D3D3] rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-[#E77000] focus:border-[#E77000] focus:outline-none"
        placeholder="Suche nach Location oder Musikgenre ..."
        required
      />
      <button
        type="submit"
        class="absolute top-0 end-0 w-[54px] flex justify-center items-center text-sm font-medium h-full text-white bg-[#E77000] rounded-r border border-[#E77000] hover:bg-[#E77000] focus:ring-4 focus:outline-none focus:ring-[#E77000] dark:bg-[#E77000]"
      >
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 20"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
          />
        </svg>
        <span class="sr-only">Search</span>
      </button>
    </div>
    <!--  <div
      class="lg:col-start-12 lg:col-end-13 bg-[#242424] absolute top-4 right-0 lg:static px-6 py-4 lg:mr-4 rounded text-center">
      Login
    </div> -->
  </DefaultGrid>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const localSearchQuery = ref('');

watch(localSearchQuery, (newQuery) => {
  router.push({ query: { ...route.query, q: newQuery } });
  if (!newQuery) {
    const { q, ...rest } = route.query;
    router.push({ query: rest });
  }
});
</script>
