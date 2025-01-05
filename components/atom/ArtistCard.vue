<template>
  <div class="">
    <div class="rounded-xl overflow-hidden h-full flex flex-col">
      <div class="h-24 w-full relative">
        <AtomMedia class="w-full h-full custom-blur-sm blur-sm relative" :isCover="true" v-bind="artist.heroImage" />
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
        <div class="flex-1 px-3 mt-8 mb-4 text-faded">
          <UtilsRichTextRenderer v-if="artist.description" :nodes="artist.description" :customClasses="'text-sm customLineHight'" />
        </div>
        <ClientOnly>
          <div v-if="artist.spotifyIframe" v-html="artist.spotifyIframe"></div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ artist: Object });
</script>

<style lang="scss" scoped>
.custom-blur-sm {
  @apply blur-sm;
  --tw-drop-shadow: none;
}
</style>
