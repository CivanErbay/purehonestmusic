<template>
  <DefaultGrid :no-spacing="true">
    <div
      v-for="(group, date) in filteredGroupedItems"
      :key="date"
      class="lg:col-start-3 lg:col-end-11"
    >
      <p class="text-2xl font-semibold mb-6">
        <span class="underline">{{ date }}</span>
      </p>
      <div
        v-for="item in group"
        :key="item.slug"
        class="lg:col-start-3 lg:col-end-11 flex bg-[#242424] mb-5 rounded-lg relative"
      >
        <NuxtImg
          :src="item.heroImage.url"
          class="w-60 lg:w-36 h-auto object-cover rounded-lg"
        />
        <div
          class="flex flex-col lg:flex-row justify-between px-4 py-3 lg:px-6 lg:py-4 w-full"
        >
          <div class="flex flex-col justify-between w-full lg:w-2/3">
            <div class="flex flex-col mb-3">
              <h4 class="text-lg text-[#D3D3D3]">{{ item.name }}</h4>
              <p class="text-sm text-white opacity-50">{{ item.subtitle }}</p>
            </div>
            <div
              class="flex flex-col lg:flex-row lg:items-center text-white opacity-40 text-sm"
            >
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
                <p class="ml-1">
                  {{ item.genres.map((it) => it.name).join(' ') }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex flex-col lg:items-end text-white text-sm mt-4">
            <NuxtImg
              class="w-6 h-5 lg:mb-4 absolute top-3 right-4 lg:static"
              src="/star1.svg"
            />
            <p class="opacity-40">
              Eine <span class="underline">{{ item.promoter }}</span
              >-Show
            </p>
            <p class="text-lg text-[#E77000]">{{ item.price }} €</p>
            <p class="opacity-40 text-[8px] lg:text-xs">
              zzgl. Vorverkaufsgebühren <br class="hidden lg:block" />
              und ggf. Abwicklungskosten
            </p>
          </div>
        </div>
      </div>
    </div>
  </DefaultGrid>
</template>
<script setup>
const { items, searchQuery } = defineProps({
  searchQuery: String,
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const weekdays = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
];

const formattedDate = (timestamp) => {
  const date = new Date(timestamp);
  const dayOfWeek = weekdays[date.getDay()];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${dayOfWeek}, ${day}.${month}`;
};

// const groupedItems = computed(() => {
//   return items.reduce((groups, item) => {
//     const dateKey = formattedDate(item.concertDate);
//     if (!groups[dateKey]) {
//       groups[dateKey] = [];
//     }
//     console.log(item.description);
//     console.log(slateToHtml(item.description));
//     groups[dateKey].push(item);
//     return groups;
//   }, {});
// });

const filteredGroupedItems = computed(() => {
  const query = searchQuery.toLowerCase();
  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query)
  );

  return filteredItems.reduce((groups, item) => {
    const dateKey = formattedDate(item.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {});
});
</script>
