<template>
  <div>
    <!-- Desktop -->
    <div
      class="hidden lg:block cursor-pointer transition-all duration-200 ease-in-out transform hover:translate-y-[-5px] hover:scale-[102%] hover:z-10 hover:shadow-xl"
      @click="(e) => {
        if (!e.target.closest('a') && !e.target.closest('NuxtLink'))
          router.push(`/concerts/${item.slug}`);
      }"
    >
      <div class="flex bg-[#242424] mb-5 rounded-xl overflow-hidden relative min-h-52">
        <NuxtLink :to="`/concerts/${item.slug}`">
          <AtomMedia
            v-if="item.heroImage || (item.artist.length > 0 && item.artist[0].heroImage)"
            v-bind="item.heroImage || (item.artist.length > 0 && item.artist[0].heroImage)"
            :isCover="true"
            class="w-60 lg:w-36 h-full object-cover"
          />
        </NuxtLink>
        <div class="flex flex-col lg:flex-row justify-between px-4 py-3 lg:px-6 lg:py-4 w-full">
          <div class="flex flex-col justify-between w-full lg:w-2/3">
            <div class="flex flex-col mb-3">
              <h4 v-if="item.name" class="text-lg text-text font-semibold">{{ item.name }}</h4>
              <p v-if="item.subtitle" class="text-sm text-white opacity-50">
                {{ truncateSubtitle(item.subtitle) }}
              </p>
            </div>
            <div class="flex flex-col lg:flex-row lg:items-center text-white opacity-40 text-sm">
              <div class="flex">
                <NuxtImg class="w-4 h-4" src="/calendar.svg" />
                <p v-if="item.date" class="ml-1">
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
                <p v-if="item.genres" class="ml-1">
                  {{ item.genres.map((it) => it.name).join(', ') }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-col lg:items-end lg:justify-between text-white text-sm bg-[#2F2F2F] -my-4 -mx-6 px-6 py-4 md:w-[250px]">
            <div class="flex">
              <div v-if="item.spotifyPreviewUrl" class="flex items-center justify-center mr-2">
                <button
                  @click.stop="toggleAudio(item.id)"
                  class="w-7 h-7 rounded-full bg-[#242424] bg-opacity-50 flex items-center justify-center relative overflow-hidden"
                >
                  <NuxtImg
                    :class="['w-3 h-3 absolute transition-opacity duration-300 ease-in-out', isPlaying(item.id) ? 'opacity-100' : 'opacity-0']"
                    src="/stop.svg"
                  />
                  <NuxtImg
                    :class="['ml-1 w-4 h-4 absolute transition-opacity duration-300 ease-in-out', !isPlaying(item.id) ? 'opacity-100' : 'opacity-0']"
                    src="/play.svg"
                  />
                </button>
                <audio :ref="el => registerAudio(item.id, el)" :src="item.spotifyPreviewUrl" />
              </div>

              <button
                :class="[
                  'rounded-full w-7 h-7 flex items-center justify-center',
                  isUserFavorite ? 'bg-[#242424] bg-opacity-50' : 'bg-[#242424] bg-opacity-50',
                ]"
                @click.stop.prevent="() => usersStore.toggleFavoriteConcert(item.id)"
              >
                <NuxtImg
                  v-if="isUserFavorite"
                  class="w-4 h-4 mt-[1px] transform transition-transform duration-300 hover:scale-110"
                  src="/heart_default.svg"
                />
                <NuxtImg
                  v-else
                  class="w-4 h-4 mt-[1px] transform transition-transform duration-300 hover:scale-110"
                  src="/heart.svg"
                />
              </button>
            </div>

            <div class="flex flex-col items-end">
              <NuxtLink
                v-if="item.promoter"
                class="opacity-40 text-right"
                :to="`/promoters/${item.promoter.slug}`"
              >
                Eine <span class="underline">{{ item.promoter.name }}</span>-Show
              </NuxtLink>
              <p v-if="showPrice" class="text-lg text-primary text-right">
                {{ item.price }}<span v-if="showEuroSymbol"> €</span>
              </p>
              <p v-if="showFeeHint" class="opacity-40 text-[8px] lg:text-xs text-right">
                ggf. zzgl. VVK-Gebühren <br class="hidden lg:block" />
                und Abwicklungskosten
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile -->
    <div
      class="lg:hidden flex flex-1 flex-col bg-[#242424] rounded-xl relative mb-5 lg:mb-0"
      @click="() => router.push(`/concerts/${item.slug}`)"
    >
      <NuxtLink :to="`/concerts/${item.slug}`">
        <AtomMedia
          v-if="item.heroImage || (item.artist.length > 0 && item.artist[0].heroImage)"
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
              'rounded-full w-7 h-7 flex items-center justify-center absolute dynamicElementHeight right-3',
              isUserFavorite ? 'bg-[#242424]' : 'bg-[#242424]',
            ]"
            @click.stop.prevent="() => usersStore.toggleFavoriteConcert(item.id)"
          >
            <NuxtImg v-if="isUserFavorite" class="w-4 h-4 mt-[1px]" src="/heart_default.svg" />
            <NuxtImg
              v-else
              class="w-4 h-4 mt-[1px] transform transition-transform duration-300 hover:scale-110"
              src="/heart_active.svg"
            />
          </button>

          <div v-if="item.spotifyPreviewUrl" class="absolute right-11 dynamicElementHeight flex items-center justify-center">
            <button @click.stop="toggleAudio(item.id)" class="w-7 h-7 rounded-full bg-[#242424] flex items-center justify-center">
              <NuxtImg
                :class="['w-3 h-3 absolute transition-opacity duration-300 ease-in-out', isPlaying(item.id) ? 'opacity-100' : 'opacity-0']"
                src="/stop.svg"
              />
              <NuxtImg
                :class="['ml-1 w-4 h-4 absolute transition-opacity duration-300 ease-in-out', !isPlaying(item.id) ? 'opacity-100' : 'opacity-0']"
                src="/play.svg"
              />
            </button>
            <audio :ref="el => registerAudio(item.id, el)" :src="item.spotifyPreviewUrl" />
          </div>

          <h4 v-if="item.name" class="text-lg text-text">{{ item.name }}</h4>
          <p v-if="item.subtitle" class="text-sm text-white opacity-50 overflow-hidden dynamicLineHeight1">
            {{ truncateSubtitle(item.subtitle) }}
          </p>
        </div>

        <div class="flex items-end text-white text-xs">
          <div class="w-1/2 p-3 pb-4">
            <div class="flex">
              <NuxtImg class="w-4 h-4" src="/calendar.svg" />
              <p v-if="item.date" class="ml-1 opacity-40">
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
              <p v-if="item.genres" class="ml-1 opacity-40">
                {{ item.genres.map((it) => it.name).join(', ') }}
              </p>
            </div>
          </div>

          <div class="flex flex-col text-right items-end w-1/2 bg-[#2F2F2F] px-3 py-5 rounded-tl-xl rounded-br-xl">
            <NuxtLink
              v-if="item.promoter"
              class="opacity-40"
              :to="`/promoters/${item.promoter.slug}`"
            >
              Eine <span class="underline">{{ item.promoter.name }}</span>-Show
            </NuxtLink>
            <p v-if="showPrice" class="text-lg text-primary text-right">
              {{ item.price }}<span v-if="showEuroSymbol">€</span>
            </p>
            <p v-if="showFeeHint" class="opacity-40 text-[8px] dynamicLineHeight lg:text-[10p] text-right">
              ggf. zzgl. VVK-Gebühren <br class="hidden lg:block" />
              und Abwicklungskosten
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAudioManager } from '@/composables/useAudioManager';

const props = defineProps({ item: Object });
const router = useRouter();
const usersStore = useUserStore();

const { registerAudio, toggleAudio, isPlaying } = useAudioManager();

const isUserFavorite = computed(() =>
  usersStore.user.favoriteConcerts.includes(props.item.id)
);

// Preislogik
const showPrice = computed(() => {
  const price = props.item?.price;
  return price !== null && price !== undefined && price !== '';
});

const showEuroSymbol = computed(() => {
  const price = props.item?.price;
  if (!price) return false;

  const normalized = price.toString().replace(/\s/g, '').toLowerCase();
  const excludedTerms = ['ausverkauft', 'tba', 'nurabendkasse', 'eintrittaufspendenbasis', 'eintrittfrei!'];
  const containsExcluded = excludedTerms.some(term =>
    normalized.includes(term)
  );
  const alreadyHasEuro = normalized.includes('€');

  return !containsExcluded && !alreadyHasEuro;
});

const showFeeHint = computed(() => {
  const price = props.item?.price;
  if (!price) return false;

  const normalized = price.toString().replace(/\s/g, '').toLowerCase();
  const excludedTerms = ['ausverkauft', 'tba', 'nurabendkasse', 'eintrittaufspendenbasis', 'eintrittfrei!'];
  return !excludedTerms.some(term => normalized.includes(term));
});
</script>
