<template>
  <DefaultGrid :no-spacing="true" class="relative flex items-center">
    <NuxtLink
      to="/"
      class="xl:col-start-1 xl:col-end-3 tracking-widest mt-6 md:mt-0"
    >
      <h1 class="text-lg">PURE.HONEST.MUSIC</h1>
      <h2 class="text-xs text-[#454545] w-max">ARTISTS / SHOWS / RECORDS</h2>
    </NuxtLink>
    <div
      class="relative w-full md:col-start-4 md:col-end-10 xl:col-start-3 xl:col-end-11 my-5"
    >
      <input
        v-model="localSearchQuery"
        type="search"
        id="search-dropdown"
        class="block p-4 w-full z-20 text-sm rounded text-gray-900 bg-text rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary focus:outline-none"
        placeholder="Suche nach Location oder Musikgenre ..."
        required
      />
      <button
        type="submit"
        class="absolute top-0 end-0 w-[54px] flex justify-center items-center text-sm font-medium h-full text-white bg-primary rounded-r border border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary dark:bg-primary"
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

    <NuxtLink
      to="/concerts/favorites"
      class="flex items-center p-4 bg-bg-light rounded-lg gap-4 xl:col-start-13 xl:col-end-13 tracking-widest mt-6 md:mt-0"
    >
      <div
        class="h-7 w-7 flex items-center justify-center rounded-full bg-[#E77000]"
      >
        <NuxtImg class="w-4 h-4 mt-[1px]" src="/heart_filled.svg" />
      </div>
      <div class="text-xl">
        {{ user?.favoriteConcerts?.length || 0 }}
      </div>
    </NuxtLink>
  </DefaultGrid>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const { user } = useUserStore();

const localSearchQuery = ref('');

watch(localSearchQuery, (newQuery) => {
  router.push({ query: { ...route.query, q: newQuery } });
  if (!newQuery) {
    const { q, ...rest } = route.query;
    router.push({ query: rest });
  }
});
</script>
