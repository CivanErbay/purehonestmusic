<template>
  <div class="mx-4 lg:mx-0 font-josefin">
    <div class="max-w-[2056px] mx-auto lg:px-16">
      <Navbar />
      <Suspense>
        <NuxtPage />
      </Suspense>
      <Footer />
    </div>
  </div>
</template>

<script setup></script>
