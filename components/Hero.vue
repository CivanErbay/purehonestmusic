<template>
  <DefaultGrid :no-spacing="true">
    <div class="lg:col-start-1 lg:col-end-13 relative">
      <div class="bg-cover bg-bottom h-[167px] lg:h-[361px] contrast-125 flex items-center rounded" :style="backgroundStyles">
        <div class="absolute inset-0 bg-black opacity-50 rounded"></div>
        <DefaultGrid :no-spacing="true" class="relative z-10">
          <h3
            class="lg:col-start-3 lg:col-end-8 text-2xl lg:text-6xl w-2/3 lg:w-full ml-4 lg:ml-0 lg:whitespace-nowrap font-bold">
            Besuche noch heute unvergessliche
            <br class="hidden lg:block">
            Konzerte in Köln
          </h3>
        </DefaultGrid>
      </div>
    </div>
  </DefaultGrid>
</template>

<script setup>
const img = useImage()
const backgroundStyles = computed(() => {
  const imgUrl = img('/bg-img.png', { width: 1200 })
  return { backgroundImage: `url('${imgUrl}')` }
})
</script>
