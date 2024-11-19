<template>
  <DefaultGrid :no-spacing="true">
    <div class="lg:col-start-3 lg:col-end-11 flex flex-col items-center">
      <div
        class="flex flex-col lg:flex-row justify-center items-center lg:items-start lg:justify-between rounded-lg bg-[#242424] text-base px-10 py-6 lg:px-32 lg:py-16 w-full"
      >
        <div class="flex justify-center items-center">
          <p>Folge uns auf:</p>
          <NuxtLink
            class="lg:ml-6 ml-2 py-1"
            target="_blank"
            to="https://www.instagram.com/pure.honest.music/"
          >
            <NuxtImg src="/instagram.svg" class="w-6 h-6 ml-2" />
          </NuxtLink>
          <NuxtLink
            class="lg:ml-1 py-1"
            target="_blank"
            to="https://open.spotify.com/user/31aufngbfn6v5zypjtwzevzw47ra"
          >
            <NuxtImg src="/spotify.svg" class="w-6 h-6 ml-2" />
          </NuxtLink>
        </div>
        <NuxtLink class="py-1" to="">Über uns</NuxtLink>
        <NuxtLink class="py-1" to="">Datenschutz</NuxtLink>
        <NuxtLink class="py-1" to="">AGB</NuxtLink>
        <NuxtLink class="py-1" to="">Impressum</NuxtLink>
      </div>
      <p class="py-4 text-text text-sm">
        © 2024 Pure.Honest.Music. Alle Rechte vorbehalten.
      </p>
    </div>
  </DefaultGrid>
</template>
