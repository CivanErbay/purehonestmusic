<template>
  <div class="mx-4 lg:mx-0 font-josefin">
    <div class="max-w-[1911px] mx-auto">
      <Navbar
        :searchQuery="searchQuery"
        @updateSearchQuery="updateSearchQuery"
      />
      <Suspense>
        <NuxtPage />
      </Suspense>
    </div>
  </div>
</template>

<script setup>
const searchQuery = useState('searchQuery', () => '')

const updateSearchQuery = (newQuery) => {
  searchQuery.value = newQuery;
};
</script>
