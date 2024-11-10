<template>
  <DefaultGrid>
    <div class="lg:col-start-3 lg:col-end-11 mt-5 lg:mt-10">
      <h4 class="text-2xl font-semibold mb-6">{{ headline }}</h4>
      <div class="flex flex-col lg:flex-row gap-x-8 relative">
        <div
          v-for="item in filteredGroupedItems.slice(0, 3)"
          :key="item.slug"
          class="flex flex-1 flex-col bg-[#242424] rounded-xl relative mb-5 lg:mb-0"
        >
          <div
            class="absolute top-0 left-0 bg-[#E77000] bg-opacity-50 py-1 px-3 h-fit rounded-br-xl rounded-tl-xl"
          >
            🔥 Empfohlen
          </div>
          <NuxtImg
            :src="item.heroImage.url"
            class="w-full h-24 object-cover rounded-t-xl"
          />
          <div class="h-full flex flex-col justify-between relative">
            <div class="flex flex-col mb-3 p-3 pb-0 w-11/12">
              <div
                class="h-7 w-7 flex absolute top-3 right-3 items-center justify-center rounded-full bg-[#E77000] bg-opacity-15 mb-2"
              >
                <NuxtImg class="w-4 h-4" src="/heart.svg" />
              </div>
              <h4 class="text-lg text-[#D3D3D3]">{{ item.name }}</h4>
              <p class="text-sm text-white opacity-50 overflow-hidden">
                {{ truncateSubtitle(item.subtitle) }}
              </p>
            </div>
            <div class="flex items-end text-white text-xs">
              <div class="w-1/2 p-3 pb-4">
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
              <div
                class="flex flex-col items-end w-1/2 bg-[#2F2F2F] px-3 py-5 rounded-tl-xl rounded-br-xl"
              >
                <p v-if="item.promoter" class="opacity-40">
                  Eine <span class="underline">{{ item.promoter.name }}</span
                  >-Show
                </p>
                <p class="text-lg text-[#E77000]">{{ item.price }} €</p>
                <p
                  class="opacity-40 text-[8px] lg:text-[10p] text-right leading-3"
                >
                  zzgl. Vorverkaufsgebühren <br class="hidden lg:block" />
                  und ggf. Abwicklungskosten
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          class="absolute h-full w-10 bg-[#242424] -right-12 top-0 hidden lg:flex items-center justify-center rounded-xl cursor-pointer"
        >
          <NuxtImg src="/arrow-right.svg" class="" />
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
  headline: {
    type: String,
    required: false,
    default: '',
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

  return filteredItems;
});
</script>
