<template>
  <DefaultGrid>
    <div class="lg:col-start-1 lg:col-end-13 relative">
      <div class="bg-cover bg-bottom h-[361px] contrast-125 flex items-center" :style="backgroundStyles">
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <DefaultGrid :no-spacing="true" class="relative z-10">
          <h3 class="lg:col-start-3 lg:col-end-8 text-6xl w-full whitespace-nowrap">
            Besuche noch heute unvergessliche
            <br>
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
