<template>
  <DefaultGrid :no-spacing="true">
    <div class="lg:col-start-3 lg:col-end-9 mt-5 lg:mt-10">
      <div class="flex bg-[#242424] mb-5 rounded-lg relative">
        <NuxtImg :src="item.heroImage.url" class="w-60 lg:w-36 h-auto object-cover rounded-l-lg" />
        <div class="h-full flex flex-col justify-between relative">
          <div class="flex flex-col p-10 w-11/12">
            <div
              class="h-7 w-7 flex absolute top-3 right-3 items-center justify-center rounded-full bg-[#E77000] bg-opacity-15 mb-2">
              <NuxtImg class="w-4 h-4" src="/heart.svg" />
            </div>
            <h4 class="text-lg text-[#D3D3D3]">{{ item.name }}</h4>
            <p class="text-sm text-white opacity-50 overflow-hidden">
              {{ item.subtitle }}
            </p>
          </div>
          <div class="flex items-center text-white text-xs bg-[#2F2F2F]">
            <div class="w-1/2 px-10 py-4">
              <div class="flex">
                <NuxtImg class="w-4 h-4" src="/calendar.svg" />
                <p class="ml-1 opacity-40">
                  {{ weekDay(item.date) }}, {{ formattedDate(item.date) }}
                </p>
              </div>
              <div class="flex my-4">
                <NuxtImg class="w-4 h-4" src="/location.svg" />
                <p class="ml-1 opacity-40">{{ item.location }}</p>
              </div>
              <div class="flex">
                <NuxtImg class="w-4 h-4" src="/music.svg" />
                <p class="ml-1 opacity-40">
                  {{ item.genres.map((it) => it.name).join(' ') }}
                </p>
              </div>
            </div>
            <div class="flex flex-col items-end w-1/2 px-10 py-5 rounded-br-xl">
              <p v-if="item.promoter" class="opacity-40">
                Eine <span class="underline">{{ item.promoter.name }}</span>-Show
              </p>
              <p class="text-lg text-[#E77000]">{{ item.price }} €</p>
              <p class="opacity-40 text-[8px] lg:text-[10p] text-right leading-3">
                zzgl. Vorverkaufsgebühren <br class="hidden lg:block" />
                und ggf. Abwicklungskosten
              </p>
              <div class="flex justify-center mt-3">
                <button @click="redirectToTicket" class="px-8 py-2 bg-orange-500 text-white rounded">
                  Zum Ticketkauf
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lg:col-start-9 lg:col-end-11 mt-5 lg:mt-10">
      <div class="flex flex-col items-center relative">
        <NuxtImg class="w-full h-22 blur-md" :src="item.heroImage.url" />
        <NuxtImg class="w-24 h-24 rounded-full top-20 absolute left-1/2 transform -translate-x-1/2 object-cover"
          :src="item.heroImage.url" />
        <div class="flex flex-col">
          <h5>{{ item.name }}</h5>
          <h6> {{ item.genres.map((it) => it.name).join(' ') }}</h6>
        </div>
      </div>
    </div>
  </DefaultGrid>
</template>

<script setup>
defineProps({ item: Object });

const redirectToTicket = () => {
  console.log("blub")
}
</script>
