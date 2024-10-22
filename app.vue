<template>
  <div class="mx-4 lg:mx-0 font-josefin">
    <div class="max-w-[2056px] mx-auto px-16">
      <Navbar
        :searchQuery="searchQuery"
        @updateSearchQuery="updateSearchQuery"
      />
      <Suspense>
        <NuxtPage />
      </Suspense>
      <Footer />
    </div>
  </div>
</template>

<script setup>
const searchQuery = useState('searchQuery', () => '')

const updateSearchQuery = (newQuery) => {
  searchQuery.value = newQuery;
};
</script>
