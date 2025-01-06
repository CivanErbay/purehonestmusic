<template>
  <NuxtLink
    class="flex flex-1 flex-col bg-[#242424] zoom-in-container rounded-xl overflow-hidden relative mb-5 xl:mb-0 md:h-[450px] 2xl:h-[390px]"
    :to="`concerts/${item.slug}`"
  >
    <div class="absolute top-0 left-0 bg-primary bg-opacity-50 py-1 px-3 h-fit rounded-br-xl dynamicZIndex">
      🔥 Empfohlen
    </div>
    <div class="">
      <AtomMedia
        v-bind="item.heroImage"
        :isCover="true"
        class="w-full h-32 object-cover !h-[128px]"
      />
    </div>
    <div class="h-full flex flex-col justify-between relative">
      <div class="flex flex-col mb-3 p-3 pb-0">
        <button
          :class="[
            'h-7 w-7 flex absolute top-3 right-3 items-center justify-center rounded-full  mb-2 dynamicElementHeight dynamicZIndex',
            item.isUserFavorite ? 'bg-[#242424]' : 'bg-[#242424]',
          ]"
          @click.stop.prevent="() => toggleFavoriteConcert(item.id)"
        >
          <NuxtImg
          v-if="item.isUserFavorite"
    class="w-4 h-4 mt-[1px] dynamicZIndex transform transition-transform duration-300 hover:scale-110"
    src="/heart_default.svg"
          />
          <NuxtImg
            v-else
            class="w-4 h-4 mt-[1px] dynamicZIndex transform transition-transform duration-300 hover:scale-110"
            src="/heart.svg"
          />
        </button>
        <h4 class="text-lg text-text font-semibold">{{ item.name }}</h4>
        <p
          v-if="item.subtitle"
          class="text-sm text-white opacity-50 overflow-hidden dynamicLineHeight1"
        >
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
        <!--<div
          class="flex flex-col items-end w-1/2 bg-[#2F2F2F] px-3 py-6 rounded-tl-xl"
        >
          <p class="text-lg text-primary">{{ item.price }} €</p>
          <p class="opacity-40 text-[8px] lg:text-[10p] text-right dynamicLineHeight">
            ggf. zzgl. VVK-Gebühren <br class="hidden lg:block" />
            und Abwicklungskosten
          </p>
        </div>-->
      </div>
    </div>
  </NuxtLink>
</template>

<style scoped>
.zoom-in-container {
  overflow: hidden;
  position: relative;
}

.zoom-in-container .object-cover {
  transition: transform 0.3s ease-in-out;
}

.zoom-in-container:hover .object-cover {
  transform: scale(1.05); /* Leichte Vergrößerung */
}
</style>

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
