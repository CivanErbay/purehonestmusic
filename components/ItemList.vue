<template>
  <DefaultGrid>
    <div class="lg:col-start-4 lg:col-end-6 mb-6">
      <p class="text-2xl font-semibold">
        <span class="underline">Heute,</span> 7.10
      </p>
    </div>
    <div v-for="item in items" :key="item.id" class="lg:col-start-4 lg:col-end-11 flex bg-[#242424] mb-5 rounded">
      <NuxtImg :src="item.img" class="w-36 h-full object-cover" />
      <div class="flex justify-between px-6 py-4 w-full">
        <div class="flex flex-col justify-between w-2/3">
          <div class="flex flex-col mb-3">
            <h4 class="text-lg text-[#D3D3D3]">{{ item.title }}</h4>
            <p class="text-sm text-white opacity-40">{{ item.description }}</p>
          </div>
          <div class="flex text-white opacity-40 text-sm">
            <div class="flex items-center">
              <NuxtImg class="w-3 h-3" src="/calendar.svg" />
              <p class="ml-1">{{ item.date }}</p>
            </div>
            <div class="flex items-center ml-6">
              <NuxtImg class="w-3 h-3" src="/location.svg" />
              <p class="ml-1">{{ item.location }}</p>
            </div>
            <div class="flex items-center ml-6">
              <NuxtImg class="w-3 h-3" src="/music.svg" />
              <p class="ml-1">{{ item.genre }}</p>
            </div>
          </div>

        </div>
        <div class="flex flex-col items-end text-white text-sm">
          <NuxtImg class="w-6 h-5 mb-4" src="/star1.svg" />
          <p class="opacity-40">Eine {{ item.provider }}-Show</p>
          <p class="text-lg text-[#E77000]">{{ item.price }} €</p>
          <p class="opacity-40 text-xs">zzgl. Vorverkaufsgebühren <br> und ggf. Abwicklungskosten</p>
        </div>
      </div>
    </div>
  </DefaultGrid>
</template>

<script setup>

const items = [
  {
    id: 1,
    img: '/image1.png',
    title: 'DEADLETTER',
    description: 'DEADLETTER ist eine britische Band, die post-punkige Klänge mit bissigen gesellschaftskritischen Texten kombiniert und durch energiegeladene Live-Auftritte beeindruckt.',
    date: 'Heute, 07.10',
    location: 'Gebäude 9',
    genre: 'Post-Punk, Alternative',
    provider: 'Popanz',
    price: '24,00'
  },
  {
    id: 2,
    img: '/image2.png',
    title: 'Tramhaus',
    description: 'Die Band Tramhaus aus Rotterdam verbindet kantigen Post-Punk mit rauer Energie und unverblümter Sozialkritik, was sie zu einem aufstrebenden Namen in der alternativen Musikszene macht.',
    date: 'Heute, 07.10',
    location: 'Artheater',
    genre: 'Post-Punk, Alternative',
    provider: 'Underdog',
    price: '19,00'
  }
]
</script>
