<template>
  <DefaultGrid :no-spacing="true">
    <div v-for="(group, date) in filteredGroupedItems" :key="date" class="lg:col-start-3 lg:col-end-11">
      <p class="text-2xl font-semibold mb-6">
        <span class="underline">{{ date }}</span>
      </p>
      <div v-for="item in group" :key="item.id"
        class="lg:col-start-3 lg:col-end-11 flex bg-[#242424] mb-5 rounded-lg relative">
        <NuxtImg :src="item.img" class="w-60 lg:w-36 h-auto lg:h-full object-cover rounded-lg" />
        <div class="flex flex-col lg:flex-row justify-between px-4 py-3 lg:px-6 lg:py-4 w-full">
          <div class="flex flex-col justify-between w-full lg:w-2/3">
            <div class="flex flex-col mb-3">
              <h4 class="text-lg text-[#D3D3D3]">{{ item.title }}</h4>
              <p class="text-sm text-white opacity-40">{{ item.description }}</p>
            </div>
            <div class="flex flex-col lg:flex-row lg:items-center text-white opacity-40 text-sm">
              <div class="flex items-center">
                <NuxtImg class="w-3 h-3" src="/calendar.svg" />
                <p class="ml-1">{{ formattedDate(item.date) }}</p>
              </div>
              <div class="flex items-center my-2 lg:my-0 lg:ml-6">
                <NuxtImg class="w-3 h-3" src="/location.svg" />
                <p class="ml-1">{{ item.location }}</p>
              </div>
              <div class="flex items-center lg:ml-6">
                <NuxtImg class="w-3 h-3" src="/music.svg" />
                <p class="ml-1">{{ item.genre }}</p>
              </div>
            </div>
          </div>
          <div class="flex flex-col lg:items-end text-white text-sm mt-4">
            <NuxtImg class="w-6 h-5 lg:mb-4 absolute top-3 right-4 lg:static" src="/star1.svg" />
            <p class="opacity-40">Eine <span class="underline">{{ item.provider }}</span>-Show</p>
            <p class="text-lg text-[#E77000]">{{ item.price }} €</p>
            <p class="opacity-40 text-[8px] lg:text-xs">zzgl. Vorverkaufsgebühren <br class="hidden lg:block"> und ggf.
              Abwicklungskosten</p>
          </div>
        </div>
      </div>
    </div>
  </DefaultGrid>
</template>
<script setup>

const props = defineProps({
  searchQuery: String
})


const items = [
  {
    id: 1,
    img: '/image1.png',
    title: 'DEADLETTER',
    description: 'DEADLETTER ist eine britische Band, die post-punkige Klänge mit bissigen gesellschaftskritischen Texten kombiniert und durch energiegeladene Live-Auftritte beeindruckt.',
    date: new Date(),
    location: 'Gebäude 9',
    genre: 'Post-Punk, Alternative',
    provider: 'Popanz',
    price: '24,00',
  },
  {
    id: 2,
    img: '/image2.png',
    title: 'Tramhaus',
    description: 'Die Band Tramhaus aus Rotterdam verbindet kantigen Post-Punk mit rauer Energie und unverblümter Sozialkritik, was sie zu einem aufstrebenden Namen in der alternativen Musikszene macht.',
    date: new Date(),
    location: 'Artheater',
    genre: 'Post-Punk, Alternative',
    provider: 'Underdog',
    price: '19,00'
  },
  {
    id: 3,
    img: '/image3.png',
    title: 'Cassels',
    description: 'Cassels ist eine britische Band, die intelligenten Noise-Rock mit introspektiven und sozialkritischen Texten zu einem rauen und experimentellen Sound verschmilzt.',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    location: 'Artheater',
    genre: 'Post-Punk, Noise-Rock',
    provider: 'Popanz',
    price: '22,00'
  }
]

const weekdays = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag']

const formattedDate = (date) => {
  const dayOfWeek = weekdays[date.getDay()]
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${dayOfWeek}, ${day}.${month}`
}

const groupedItems = computed(() => {
  return items.reduce((groups, item) => {
    const dateKey = formattedDate(item.date)
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(item)
    return groups
  }, {})
})

const filteredGroupedItems = computed(() => {
  const query = props.searchQuery.toLowerCase()
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(query) ||item.location.toLowerCase().includes(query) || item.genre.toLowerCase().includes(query)
  )

  return filteredItems.reduce((groups, item) => {
    const dateKey = formattedDate(item.date)
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(item)
    return groups
  }, {})
})
</script>
