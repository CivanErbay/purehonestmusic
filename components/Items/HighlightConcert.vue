<template>
  <NuxtLink
    class="flex flex-1 flex-col bg-[#242424] zoom-in-container rounded-xl overflow-hidden relative mb-5 xl:mb-0 md:h-[450px] 2xl:h-[390px]"
    :to="`concerts/${item.slug}`"
  >
    <div class="absolute top-0 left-0 bg-primary bg-opacity-50 py-1 px-3 h-fit rounded-br-xl dynamicZIndex">
      🔥 Empfohlen
    </div>

    <div>
      <AtomMedia
        v-bind="item.heroImage"
        :isCover="true"
        class="w-full h-32 object-cover !h-[128px]"
      />
    </div>

    <div class="h-full flex flex-col justify-between relative">
      <div class="flex flex-col mb-3 p-3 pb-0">
        <!-- ✅ Spotify Preview Button ohne Transparenz -->
        <div
          v-if="item.spotifyPreviewUrl"
          class="absolute top-3 right-12 flex items-center justify-center dynamicElementHeight z-20"
        >
          <button
            @click.stop="toggleAudio(item.id)"
            class="w-7 h-7 rounded-full bg-[#242424] flex items-center justify-center relative overflow-hidden"
            :aria-label="isPlayingUi(item.id) ? 'Vorschau stoppen' : 'Vorschau abspielen'"
          >
            <NuxtImg
              :class="['w-3 h-3 absolute transition-opacity duration-300 ease-in-out', isPlayingUi(item.id) ? 'opacity-100' : 'opacity-0']"
              src="/stop.svg"
              alt=""
              aria-hidden="true"
              role="presentation"
            />
            <NuxtImg
              :class="['ml-1 w-4 h-4 absolute transition-opacity duration-300 ease-in-out', !isPlayingUi(item.id) ? 'opacity-100' : 'opacity-0']"
              src="/play.svg"
              alt=""
              aria-hidden="true"
              role="presentation"
            />
          </button>
          <audio :ref="el => registerAudioWithEnd(item.id, el)" :src="item.spotifyPreviewUrl" />
        </div>

        <!-- ❤️ Favorit-Button -->
        <button
          :class="[
            'h-7 w-7 flex absolute top-3 right-3 items-center justify-center rounded-full mb-2 dynamicElementHeight dynamicZIndex',
            item.isUserFavorite ? 'bg-[#242424]' : 'bg-[#242424]',
          ]"
          @click.stop.prevent="() => toggleFavoriteConcert(item.id)"
        >
          <NuxtImg
            v-if="item.isUserFavorite"
            class="w-4 h-4 mt-[1px] dynamicZIndex transform transition-transform duration-300 hover:scale-110"
            src="/heart_default.svg"
            alt=""
            aria-hidden="true"
            role="presentation"
          />
          <NuxtImg
            v-else
            class="w-4 h-4 mt-[1px] dynamicZIndex transform transition-transform duration-300 hover:scale-110"
            src="/heart.svg"
            alt=""
            aria-hidden="true"
            role="presentation"
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
            <NuxtImg class="w-4 h-4" src="/calendar.svg" alt="" aria-hidden="true" role="presentation" />
            <p class="ml-1 opacity-40">
              {{ weekDay(item.date) }}, {{ formattedDate(item.date) }}
            </p>
          </div>
          <div class="flex my-4">
            <NuxtImg class="w-4 h-4" src="/location.svg" alt="" aria-hidden="true" role="presentation" />
            <p class="ml-1 opacity-40">{{ item.venue.name }}</p>
          </div>
          <div class="flex">
            <NuxtImg class="w-4 h-4" src="/music.svg" alt="" aria-hidden="true" role="presentation" />
            <p class="ml-1 opacity-40">
              {{ item.genres.map((it) => it.name).join(', ') }}
            </p>
          </div>
        </div>

        <div class="flex flex-col items-end w-1/2 bg-[#2F2F2F] px-3 py-6 rounded-tl-xl">
          <p v-if="showPrice" class="text-lg text-primary text-right">
            {{ item.price }}<span v-if="showEuroSymbol"> €</span>
          </p>
          <p
            v-if="showFeeHint"
            class="opacity-40 text-[8px] lg:text-[10p] text-right dynamicLineHeight"
          >
            ggf. zzgl. VVK-Gebühren <br class="hidden lg:block" />
            und Abwicklungskosten
          </p>
        </div>
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
  transform: scale(1.05);
}
</style>

<script setup>
import { computed, onMounted, watch, ref } from 'vue'
import { useAudioManager } from '@/composables/useAudioManager'

const props = defineProps({
  item: Object,
})

/* --- Favorites --- */
const usersStore = useUserStore()
const { isConcertFavorite, toggleFavoriteConcert, user } = usersStore

watch(user.favoriteConcerts, () => {
  props.item.isUserFavorite = isConcertFavorite(props.item.id)
})

onMounted(() => {
  props.item.isUserFavorite = isConcertFavorite(props.item.id)
})

/* --- Spotify Preview --- */
const { registerAudio, toggleAudio, isPlaying } = useAudioManager()

/** UI-Flag „per ended gestoppt“ */
const endedFlags = ref({})
const markEnded = (id) => { endedFlags.value[id] = true }
const clearEnded = (id) => { if (endedFlags.value[id]) delete endedFlags.value[id] }

/** „Spielt gerade?“ (mit Ende-Flag berücksichtigt) */
const isPlayingUi = (id) => isPlaying(id) && !endedFlags.value[id]

/** Audio registrieren & 'ended' sauber behandeln */
function registerAudioWithEnd(id, el) {
  registerAudio(id, el)
  if (!el) return
  if (el.__phmEndedHandler) el.removeEventListener('ended', el.__phmEndedHandler)
  if (el.__phmPlayHandler) el.removeEventListener('play', el.__phmPlayHandler)

  el.__phmEndedHandler = () => {
    try {
      el.currentTime = 0
      el.pause?.()
      el.dispatchEvent(new Event('pause'))
    } catch {}
    markEnded(id)
  }
  el.__phmPlayHandler = () => { clearEnded(id) }

  el.addEventListener('ended', el.__phmEndedHandler)
  el.addEventListener('play', el.__phmPlayHandler)
}

/* --- Preis-Anzeige --- */
const showPrice = computed(() => {
  const price = props.item?.price
  return price !== null && price !== undefined && price !== ''
})

const showEuroSymbol = computed(() => {
  const price = props.item?.price
  if (!price) return false
  const normalized = price.toString().replace(/\s/g, '').toLowerCase()
  const excludedTerms = ['ausverkauft', 'tba', 'nurabendkasse', 'eintrittaufspendenbasis', 'eintrittfrei!']
  const containsExcluded = excludedTerms.some(term => normalized.includes(term))
  const alreadyHasEuro = normalized.includes('€')
  return !containsExcluded && !alreadyHasEuro
})

const showFeeHint = computed(() => {
  const price = props.item?.price
  if (!price) return false
  const normalized = price.toString().replace(/\s/g, '').toLowerCase()
  const excludedTerms = ['ausverkauft', 'tba', 'nurabendkasse', 'eintrittaufspendenbasis', 'eintrittfrei!']
  return !excludedTerms.some(term => normalized.includes(term))
})

/* --- Datumshelfer --- */
function parseLocalDate(dateStr) {
  if (!dateStr) return new Date(NaN)
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr)
  if (m) return new Date(+m[1], +m[2] - 1, +m[3])
  return new Date(dateStr)
}

function weekDay(dateStr) {
  const d = parseLocalDate(dateStr)
  if (isNaN(d)) return ''
  const abbr = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  return abbr[d.getDay()]
}

function formattedDate(dateStr) {
  const d = parseLocalDate(dateStr)
  if (isNaN(d)) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).toString().padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}
</script>
