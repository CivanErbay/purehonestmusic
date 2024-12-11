<template>
  <NuxtLink
    class="flex flex-1 flex-col bg-[#242424] rounded-xl overflow-hidden relative mb-5 lg:mb-0 lg:h-[370px]"
    :to="`concerts/${item.slug}`"
  >
    <div
      class="absolute top-0 left-0 bg-primary bg-opacity-50 py-1 px-3 h-fit rounded-br-xl"
    >
      🔥 Empfohlen
    </div>
    <AtomMedia
      v-bind="item.heroImage"
      :isCover="true"
      class="w-full h-32 object-cover"
    />
    <div class="h-full flex flex-col justify-between relative">
      <div class="flex flex-col mb-3 p-3 pb-0 w-11/12">
        <button
          :class="[
            'h-7 w-7 flex absolute top-3 right-3 items-center justify-center rounded-full  mb-2',
            item.isUserFavorite ? 'bg-[#E77000]' : 'bg-primary bg-opacity-15',
          ]"
          @click.stop.prevent="() => toggleFavoriteConcert(item.id)"
        >
          <NuxtImg
            v-if="item.isUserFavorite"
            class="w-4 h-4 mt-[1px]"
            src="/heart_filled.svg"
          />
          <NuxtImg v-else class="w-4 h-4 mt-[1px]" src="/heart.svg" />
        </button>
        <h4 class="text-lg text-text">{{ item.name }}</h4>
        <p v-if="item.subtitle" class="text-sm text-white opacity-50 overflow-hidden">
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
            <p class="ml-1 opacity-40">{{ item.venue.name }}</p>
          </div>
          <div class="flex">
            <NuxtImg class="w-4 h-4" src="/music.svg" />
            <p class="ml-1 opacity-40">
              {{ item.genres.map((it) => it.name).join(', ') }}
            </p>
          </div>
        </div>
        <div
          class="flex flex-col items-end w-1/2 bg-[#2F2F2F] px-3 py-5 rounded-tl-xl"
        >
          <NuxtLink
            v-if="item.promoter"
            class="opacity-40"
            :to="`/promoters/${item.promoter.slug}`"
          >
            Eine <span class="underline">{{ item.promoter.name }}</span
            >-Show
          </NuxtLink>
          <p class="text-lg text-primary">{{ item.price }} €</p>
          <p class="opacity-40 text-[8px] lg:text-[10p] text-right leading-3">
            ggf. zzgl. Vorverkaufsgebühren <br class="hidden lg:block" />
            und Abwicklungskosten
          </p>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
const props = defineProps({
  item: Object,
});

const usersStore = useUserStore();
const { isConcertFavorite, toggleFavoriteConcert, user } = usersStore;

watch(user.favoriteConcerts, () => {
  props.item.isUserFavorite = isConcertFavorite(props.item.id);
});

onMounted(() => {
  props.item.isUserFavorite = isConcertFavorite(props.item.id);
});
</script>
