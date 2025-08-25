<template>
  <div
    class="fixed bottom-8 w-4/5 lg:w-[800px] py-6 px-4 flex z-[1000] left-1/2 -translate-x-1/2 items-center bg-bg border border-primary rounded-xl">
    <div>
      <div class="flex flex-col flex-1">
        <p class="font-semibold">{{ settings.cookieHeadline }}</p>
        <p class="text-sm lg:text-base font-light py-2">
          {{ settings.cookieDescription }}
        </p>
      </div>
      <div class="flex justify-between lg:justify-end lg:gap-6">
        <button class="btn px-3 lg:px-6 bg-transparent text-gray-400 hover:bg-bg-light" @click="$emit('declineCookies')">
          {{ settings.cookieDecline }}
        </button>
        <button class="btn px-3 lg:px-6" :text="settings.cookieAccept" @click="$emit('acceptCookies')">
          {{ settings.cookieAccept }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  settings: Object,
});

defineEmits(['acceptCookies', 'declineCookies']);
</script>

<style lang="scss" scoped></style>
