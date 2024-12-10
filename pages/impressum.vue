<template>
  <div>
    <DefaultGrid :no-spacing="true" class="mt-5 lg:mt-10 mb-8">
      <div
        class="lg:col-start-3 p-4 md:p-8 lg:col-end-11 flex bg-[#242424] rounded-lg"
      >
        <UtilsRichTextRenderer :nodes="settingsData.imprint" />
      </div>
    </DefaultGrid>
  </div>
</template>

<script setup>
const { data: settingsData } = await fetchGlobalHandler('settings');
</script>

<style lang="scss" scoped></style>
