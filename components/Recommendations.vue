<template>
  <DefaultGrid>
    <div class="lg:col-start-3 lg:col-end-11 mt-5 lg:mt-10">
      <h4 class="text-2xl font-semibold mb-6">Unsere
        Konzertempfehlungen
      </h4>
      <div class="flex gap-x-8">
        <div v-for="item in filteredGroupedItems" :key="item.slug"
          class="flex flex-col bg-[#242424] mb-5 rounded-lg relative break-all h-72">
          <NuxtImg :src="item.heroImage.url" class="w-full h-24 object-cover rounded-l-lg" />
          <div class="flex flex-col p-2.5">
            <div class="flex flex-col mb-3">
              <h4 class="text-lg text-[#D3D3D3]">{{ item.name }}</h4>
              <p class="text-sm text-white opacity-50 overflow-hidden">{{ truncateSubtitle(item.subtitle) }}</p>
            </div>
            <div class="flex text-white opacity-40 text-sm">
              <div class="w-1/2">
                <div class="flex ">
                  <NuxtImg class="w-4 h-4" src="/calendar.svg" />
                  <p class="ml-1">{{ weekDay(item.date) }}, {{ formattedDate(item.date) }}</p>
                </div>
                <div class="flex my-2 ">
                  <NuxtImg class="w-4 h-4" src="/location.svg" />
                  <p class="ml-1">{{ item.location }}</p>
                </div>
                <div class="flex">
                  <NuxtImg class="w-4 h-4" src="/music.svg" />
                  <p class="ml-1">
                    {{ item.genres.map((it) => it.name).join(' ') }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col items-end w-1/2 bg-[#2F2F2F] p-3 rounded-">
                <p class="opacity-40">
                  Eine <span class="underline">{{ item.promoter }}</span>-Show
                </p>
                <p class="text-lg text-[#E77000]">{{ item.price }} €</p>
                <p class="opacity-40 text-[8px] lg:text-[10p] text-right leading-3">
                  zzgl. Vorverkaufsgebühren <br class="hidden lg:block" />
                  und ggf. Abwicklungskosten
                </p>
              </div>
            </div>
            <!--  <div class="flex flex-col lg:items-end lg:justify-between text-white text-sm">
              <div
                class="h-7 w-7 flex absolute top-3 right-4 lg:static items-center justify-center rounded-full bg-[#E77000] bg-opacity-15 mb-2">
                <NuxtImg class="w-4 h-4 mb-0.5" src="/star1.svg" />
              </div>


            </div> -->
          </div>
        </div>
      </div>
    </div>
  </DefaultGrid>
</template>

<script setup>
const { items } = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const filteredGroupedItems = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredItems = items
    .filter((item) => {
      const itemDate = new Date(item.date);
      itemDate.setHours(0, 0, 0, 0);
      return itemDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  if (filteredItems.length > 5) {
    showMoreButton.value = true;
  }

  return filteredItems/* .reduce((groups, item) => {
    const dateKey = formattedDate(item.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {}); */
});


</script>
