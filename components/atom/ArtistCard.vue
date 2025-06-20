<template>
  <div class="">
    <div class="rounded-xl overflow-hidden h-full flex flex-col">
      <div class="h-24 w-full relative">
        <AtomMedia class="w-full h-full blur-sm relative" :isCover="true" v-bind="artist.heroImage" />
        <div
          class="w-24 z-20 h-24 overflow-hidden rounded-full top-full absolute left-1/2 -translate-x-1/2 -translate-y-1/2">
          <AtomMedia class="w-full h-full" v-bind="artist.heroImage" :isCover="true" />
        </div>
      </div>

      <div class="pt-12 flex flex-col h-full flex-1 z-10 bg-[#242424]">
        <h6 class="text-center px-3 pt-3 font-semibold">{{ artist.name }}</h6>
        <h5 class="opacity-70 text-sm text-center px-3">
          {{ artist.genres?.map((it) => it.name).join(', ') }}
        </h5>


<div class="mt-2 flex justify-center items-center">
  <!-- Instagram Link mit Icon -->
  <NuxtLink
    v-if="artist.instagramLink"
    :to="artist.instagramLink"
    class="flex items-center justify-center w-10 h-10 py-1"
    target="_blank"
  >
    <NuxtImg src="/instagram.svg" class="w-5 h-5" />
  </NuxtLink>

  <!-- Spotify Link mit Icon -->
  <NuxtLink
    v-if="artist.spotifyLink"
    :to="artist.spotifyLink"
    class="flex items-center justify-center w-10 h-10 py-1"
    target="_blank"
  >
    <NuxtImg src="/spotify.svg" class="w-5 h-5" />
  </NuxtLink>
</div>

        <div class="flex-1 px-3 mt-5 mb-4 text-faded">
          <UtilsRichTextRenderer v-if="artist.description" :nodes="artist.description" :customClasses="'text-sm customLineHight'" />
        </div>
        <ClientOnly>
          <div class="mt-4" v-if="artist.spotifyIframe" v-html="artist.spotifyIframe"></div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ artist: Object });
</script>

<style lang="scss" scoped></style>

