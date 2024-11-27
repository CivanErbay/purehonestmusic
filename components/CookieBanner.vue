<template>
  <div
    v-if="status === 'success'"
    class="fixed bottom-8 left-8 w-[600px] py-6 px-4 flex items-center bg-bg border border-primary rounded-xl"
  >
    <div class="">
      <div class="flex flex-col flex-1">
        <p class="font-semibold">{{ settings.cookieHeadline }}</p>
        <p class="text-sm lg:text-base font-light py-2">
          {{ settings.cookieDescription }}
        </p>
      </div>
      <div class="flex justify-end gap-6">
        <button
          class="btn"
          :text="settings.cookieAccept"
          @click="$emit('acceptCookies')"
        >
          {{ settings.cookieAccept }}
        </button>
        <button
          variant="secondary"
          class="btn"
          @click="$emit('declineCookies')"
        >
          {{ settings.cookieDecline }}
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
