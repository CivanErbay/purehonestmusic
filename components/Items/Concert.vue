<template>
  <div>
    <!-- This NuxtLink is only visible on desktop -->
    <div
      class="hidden lg:block cursor-pointer transition-all duration-200 ease-in-out transform hover:translate-y-[-5px] hover:scale-[102%] hover:z-10 hover:shadow-xl"
      @click="
        (e) => {
          if (!e.target.closest('a') && !e.target.closest('NuxtLink'))
            router.push(`/concerts/${item.slug}`);
        }
      "
    >
      <div
        class="flex bg-[#242424] mb-5 rounded-xl overflow-hidden relative min-h-52"
      >
        <!-- fallback to artist image if no concert image -->
        <NuxtLink :to="`/concerts/${item.slug}`">
          <AtomMedia
            v-bind="
              item.heroImage ||
              (item.artist.length > 0 && item.artist[0].heroImage)
            "
            :isCover="true"
            class="w-60 lg:w-36 h-full object-cover"
          />
        </NuxtLink>
        <div
          class="flex flex-col lg:flex-row justify-between px-4 py-3 lg:px-6 lg:py-4 w-full"
        >
          <div class="flex flex-col justify-between w-full lg:w-2/3">
            <div class="flex flex-col mb-3">
              <h4 class="text-lg text-text">{{ item.name }}</h4>
              <p class="text-sm text-white opacity-50">
                {{ truncateSubtitle(item.subtitle) }}
              </p>
            </div>
            <div
              class="flex flex-col lg:flex-row lg:items-center text-white opacity-40 text-sm"
            >
              <div class="flex">
                <NuxtImg class="w-4 h-4" src="/calendar.svg" />
                <p class="ml-1">
                  {{ weekDay(item.date) }}, {{ formattedDate(item.date) }}
                </p>
              </div>
              <NuxtLink :to="`/locations/${item.venue.slug}`" v-if="item.venue">
                <div class="flex my-2 lg:my-0 lg:ml-6">
                  <NuxtImg class="w-4 h-4" src="/location.svg" />
                  <p class="ml-1">{{ item.venue.name }}</p>
                </div>
              </NuxtLink>

              <div class="flex lg:ml-6">
                <NuxtImg class="w-4 h-4" src="/music.svg" />
                <p class="ml-1">
                  {{ item.genres.map((it) => it.name).join(', ') }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col lg:items-end lg:justify-between text-white text-sm bg-[#2F2F2F] -my-4 -mx-6 px-6 py-4 md:w-[240px]"
          >
            <button
              :class="[
                'rounded-full w-7 h-7 flex items-center justify-center',
                item.isUserFavorite
                  ? 'bg-[#E77000]'
                  : 'bg-primary bg-opacity-15',
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

            <div class="flex flex-col items-end">
              <NuxtLink
                v-if="item.promoter"
                class="opacity-40"
                :to="`/promoters/${item.promoter.slug}`"
              >
                Eine <span class="underline">{{ item.promoter.name }}</span
                >-Show
              </NuxtLink>
              <p class="text-lg text-primary">{{ item.price }} €</p>
              <p class="opacity-40 text-[8px] lg:text-xs text-right">
                ggf. zzgl. Vorverkaufsgebühren <br class="hidden lg:block" />
                und Abwicklungskosten
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- This NuxtLink is only visible on mobile -->
    <div
      class="lg:hidden flex flex-1 flex-col bg-[#242424] rounded-xl relative mb-5 lg:mb-0"
      @click="() => router.push(`/concerts/${item.slug}`)"
    >
     <!--  <div
        class="absolute top-0 left-0 bg-primary bg-opacity-50 py-1 px-3 h-fit rounded-br-xl rounded-tl-xl"
      >
        🔥 Empfohlen
      </div> -->
      <NuxtLink :to="`/concerts/${item.slug}`">
        <AtomMedia
          v-bind="item.heroImage"
          :isCover="true"
          class="w-full h-24 object-cover rounded-t-xl"
          :customClasses="'rounded-tr-xl rounded-tl-xl'"
        />
      </NuxtLink>
      <div class="h-full flex flex-col justify-between relative">
        <div class="flex flex-col mb-3 p-3 pb-0 w-11/12">
          <button
            :class="[
              'rounded-full w-7 h-7 flex items-center justify-center absolute right-3',
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
            <div>
              <NuxtLink :to="`/locations/${item.venue.slug}`" v-if="item.venue">
                <div class="flex my-4">
                  <NuxtImg class="w-4 h-4" src="/location.svg" />
                  <p class="ml-1 opacity-40">{{ item.venue.name }}</p>
                </div>
              </NuxtLink>
            </div>
            <div class="flex">
              <NuxtImg class="w-4 h-4" src="/music.svg" />
              <p class="ml-1 opacity-40">
                {{ item.genres.map((it) => it.name).join(', ') }}
              </p>
            </div>
          </div>
          <div
            class="flex flex-col items-end w-1/2 bg-[#2F2F2F] px-3 py-5 rounded-tl-xl rounded-br-xl"
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
            <p class="opacity-40 text-[8px] lg:text-[10p] text-right leading-4">
              ggf.zzgl. Vorverkaufsgebühren <br class="hidden lg:block" />
              und Abwicklungskosten
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ item: Object });

const router = useRouter();

const usersStore = useUserStore();
const { isConcertFavorite, toggleFavoriteConcert, user } = usersStore;

watch(user.favoriteConcerts, () => {
  props.item.isUserFavorite = isConcertFavorite(props.item.id);
});

onMounted(() => {
  props.item.isUserFavorite = isConcertFavorite(props.item.id);
});
</script>
