<template>
  <DefaultGrid :no-spacing="true">
    <!-- Volle Breite im 12er-Grid auf XL -->
    <div class="xl:col-start-1 xl:col-end-[-1] flex flex-col items-center mt-4">
      <div
        class="flex flex-col xl:flex-row justify-center items-center xl:items-start xl:justify-between rounded-lg bg-[#242424] text-base px-10 py-6 xl:px-32 xl:py-16 w-full"
      >
        <div class="flex justify-center items-center">
          <p>Folge uns auf:</p>
          <NuxtLink
            class="xl:ml-6 ml-2 py-1"
            target="_blank"
            to="https://www.instagram.com/purehonestmusic_/"
          >
            <NuxtImg src="/instagram.svg" class="w-6 h-6 ml-2" />
          </NuxtLink>
        <NuxtLink
            class="xl:ml-1 py-1"
            target="_blank"
            to="https://open.spotify.com/user/31aufngbfn6v5zypjtwzevzw47ra"
          >
            <NuxtImg src="/spotify.svg" class="w-6 h-6 ml-2" />
          </NuxtLink>
        </div>

        <NuxtLink class="py-1 hover:underline" to="/about-us">Über uns</NuxtLink>
        <NuxtLink class="py-1 hover:underline" to="/datenschutz">Datenschutz</NuxtLink>
        <NuxtLink class="py-1 hover:underline" to="/impressum">Impressum</NuxtLink>
      </div>

      <p class="py-4 text-text footer">{{ settings.copyright }}.</p>
    </div>
  </DefaultGrid>
</template>

<script setup>
defineProps({
  settings: Object,
});
</script>

<style>
.footer {
  font-size: 0.74rem !important;
}
</style>
