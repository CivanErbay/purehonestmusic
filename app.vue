<template>
  <div class="mx-4 lg:mx-0 font-josefin">
    <div class="max-w-[1911px] mx-auto">
      <!-- Pass the search query and update function as props to Navbar and ItemList -->
      <Navbar :searchQuery="searchQuery" @updateSearchQuery="updateSearchQuery" />
      <Hero />
      <ItemList :searchQuery="searchQuery" />
    </div>
  </div>
</template>

<script setup>
const searchQuery = ref('')

const updateSearchQuery = (newQuery) => {
  searchQuery.value = newQuery
}
</script>
