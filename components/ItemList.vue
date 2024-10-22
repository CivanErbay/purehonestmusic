<template>
  <DefaultGrid :no-spacing="true">
    <div class="lg:col-start-3 lg:col-end-11">
      <div v-for="(group, date, index) in visibleGroupedItems" :key="date" class="mb-16">
        <p class="text-2xl font-semibold mb-6">
          <span :class="{ 'underline': weekDay(group[0].date) === 'Heute' }">{{ weekDay(group[0].date) }},</span> {{
          date
          }}
        </p>
        <div v-for="item in group" :key="item.slug"
          class="lg:col-start-3 lg:col-end-11 flex bg-[#242424] mb-5 rounded-lg relative break-all">
          <NuxtImg :src="item.heroImage.url" class="w-60 lg:w-36 h-auto object-cover rounded-l-lg" />
          <div class="flex flex-col lg:flex-row justify-between px-4 py-3 lg:px-6 lg:py-4 w-full">
            <div class="flex flex-col justify-between w-full lg:w-2/3">
              <div class="flex flex-col mb-3">
                <h4 class="text-lg text-[#D3D3D3]">{{ item.name }}</h4>
                <p class="text-sm text-white opacity-50">{{ item.subtitle }}</p>
              </div>
              <div class="flex flex-col lg:flex-row lg:items-center text-white opacity-40 text-sm">
                <div class="flex ">
                  <NuxtImg class="w-4 h-4" src="/calendar.svg" />
                  <p class="ml-1">{{ weekDay(item.date) }}, {{ formattedDate(item.date) }}</p>
                </div>
                <div class="flex  my-2 lg:my-0 lg:ml-6">
                  <NuxtImg class="w-4 h-4" src="/location.svg" />
                  <p class="ml-1">{{ item.location }}</p>
                </div>
                <div class="flex  lg:ml-6">
                  <NuxtImg class="w-4 h-4" src="/music.svg" />
                  <p class="ml-1">
                    {{ item.genres.map((it) => it.name).join(' ') }}
                  </p>
                </div>
              </div>
            </div>
            <div class="flex flex-col lg:items-end lg:justify-between text-white text-sm">
              <div
                class="h-7 w-7 flex absolute top-3 right-4 lg:static items-center justify-center rounded-full bg-[#E77000] bg-opacity-15 mb-2">
                <NuxtImg class="w-4 h-4 mb-0.5" src="/star1.svg" />
              </div>

              <div class="flex flex-col items-end">
                <p class="opacity-40">
                  Eine <span class="underline">{{ item.promoter }}</span>-Show
                </p>
                <p class="text-lg text-[#E77000]">{{ item.price }} €</p>
                <p class="opacity-40 text-[8px] lg:text-xs text-right">
                  zzgl. Vorverkaufsgebühren <br class="hidden lg:block" />
                  und ggf. Abwicklungskosten
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="showMoreButton" class="flex justify-center">
        <button @click="showMoreDays" class="px-8 py-2 bg-orange-500 text-white rounded" :class="{ 'opacity-50 pointer-events-none': totalVisibleConcerts >= totalConcerts }">Mehr Konzerte anzeigen</button>
      </div>

      <div class="flex justify-center mt-2 text-gray-400 mb-16">
        <p class="text-sm">{{ totalVisibleConcerts }} von {{ totalConcerts }} Konzerten</p>
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

const maxDays = ref(3);  // Limit the number of days initially shown
const showMoreButton = ref(false);

const weekdays = [
  'Sonntag',
  'Montag',
  'Dienstag',
  'Mittwoch',
  'Donnerstag',
  'Freitag',
  'Samstag',
];

const weekDay = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();
  const dayOfWeek = weekdays[date.getDay()];

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return `Heute`;
  } else {
    return `${dayOfWeek}`;
  }
};

const formattedDate = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  return `${day}.${month}`;
};

const filteredGroupedItems = computed(() => {
  const query = searchQuery.toLowerCase();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredItems = items
    .filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
    )
    .filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (filteredItems.length > 5) {
    showMoreButton.value = true;
  }

  return filteredItems.reduce((groups, item) => {
    const dateKey = formattedDate(item.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {});
});

const visibleGroupedItems = computed(() => {
  const groupedDates = Object.keys(filteredGroupedItems.value);
  return groupedDates.slice(0, maxDays.value).reduce((result, date) => {
    result[date] = filteredGroupedItems.value[date];
    return result;
  }, {});
});

// Total number of visible concerts
const totalVisibleConcerts = computed(() => {
  return Object.values(visibleGroupedItems.value).flat().length;
});

// Total number of concerts (all days)
const totalConcerts = computed(() => {
  return Object.values(filteredGroupedItems.value).flat().length;
});

const showMoreDays = () => {
  maxDays.value += 3;
};

</script>
