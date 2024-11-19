<template>
  <div
    v-if="status === 'success'"
    class="fixed bottom-8 left-8 w-[600px] py-6 px-4 flex items-center bg-bg border border-primary rounded-xl"
  >
    <div class="">
      <div class="flex flex-col flex-1">
        <p class="font-semibold">{{ data.cookieHeadline }}</p>
        <p class="text-sm lg:text-base font-light py-2">
          {{ data.cookieDescription }}
        </p>
      </div>
      <div class="flex justify-end gap-6">
        <button
          class="btn"
          :text="data.cookieAccept"
          @click="$emit('acceptCookies')"
        >
          {{ data.cookieAccept }}
        </button>
        <button
          variant="secondary"
          class="btn"
          @click="$emit('declineCookies')"
        >
          {{ data.cookieDecline }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data, status } = await fetchGlobalHandler('settings');

defineEmits(['acceptCookies', 'declineCookies']);
</script>

<style lang="scss" scoped></style>
