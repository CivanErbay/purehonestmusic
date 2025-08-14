<template>
  <div>
    <!-- Desktop -->
    <div
      class="hidden lg:block cursor-pointer transition-all duration-200 ease-in-out transform hover:translate-y-[-5px] hover:scale-[102%] hover:z-10 hover:shadow-xl rounded-xl
             outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
      role="link"
      :aria-label="cardAriaLabel"
      tabindex="0"
      @keydown="onCardKeydown($event, item.slug)"
      @click="(e) => {
        if (!e.target.closest('a') && !e.target.closest('NuxtLink') && !e.target.closest('button'))
          router.push(`/concerts/${item.slug}`);
      }"
    >
      <div class="flex bg-[#242424] mb-5 rounded-xl overflow-hidden relative min-h-52">
        <NuxtLink
          :to="`/concerts/${item.slug}`"
          class="relative inline-block group
                 rounded-l-xl outline-none
                 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
        >
          <!-- Badge: Desktop nur auf Hover, unten links bündig -->
          <span
            v-if="heroAltPayload"
            class="hidden lg:block absolute bottom-0 left-0 z-10 text-[10px] leading-none px-2 py-1
                   bg-black/60 text-white/80 rounded-tr pointer-events-none
                   opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
          >
            {{ heroAltPayload }}
          </span>

          <AtomMedia
            v-if="item.heroImage || (item.artist.length > 0 && item.artist[0].heroImage)"
            v-bind="item.heroImage || (item.artist.length > 0 && item.artist[0].heroImage)"
            :isCover="true"
            :alt="heroAltPayload || heroAltFallback"
            class="w-60 lg:w-36 h-full object-cover"
          />
        </NuxtLink>

        <div class="flex flex-col lg:flex-row justify-between px-4 py-3 lg:px-6 lg:py-4 w-full">
          <div class="flex flex-col justify-between w-full lg:w-2/3">
            <div class="flex flex-col mb-3">
              <h4 v-if="item.name" class="text-lg text-text font-semibold mb-2">{{ item.name }}</h4>
              <p v-if="item.subtitle" class="text-sm text-white opacity-50">
                {{ truncateSubtitle(item.subtitle) }}
              </p>
            </div>
            <div class="flex flex-col lg:flex-row lg:items-center text-white opacity-40 text-sm">
              <div class="flex">
                <NuxtImg class="w-4 h-4" src="/calendar.svg" alt="" aria-hidden="true" role="presentation" />
                <p v-if="item.date" class="ml-1">
                  <span :class="isToday(item.date) ? 'underline decoration-orange-500 underline-offset-2' : ''">
                    {{ weekDay(item.date) }}
                  </span>,
                  {{ formattedDate(item.date) }}
                </p>
              </div>
              <NuxtLink :to="`/locations/${item.venue.slug}`" v-if="item.venue">
                <div class="flex my-2 lg:my-0 lg:ml-6">
                  <NuxtImg class="w-4 h-4" src="/location.svg" alt="" aria-hidden="true" role="presentation" />
                  <p class="ml-1">{{ item.venue.name }}</p>
                </div>
              </NuxtLink>
              <div class="flex lg:ml-6">
                <NuxtImg class="w-4 h-4" src="/music.svg" alt="" aria-hidden="true" role="presentation" />
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
                  :aria-label="isPlayingUi(item.id) ? 'Vorschau stoppen' : 'Vorschau abspielen'"
                >
                  <NuxtImg
                    :class="['w-3 h-3 absolute transition-opacity duration-300 ease-in-out', isPlayingUi(item.id) ? 'opacity-100' : 'opacity-0']"
                    src="/stop.svg" alt="" aria-hidden="true" role="presentation"
                  />
                  <NuxtImg
                    :class="['ml-1 w-4 h-4 absolute transition-opacity duration-300 ease-in-out', !isPlayingUi(item.id) ? 'opacity-100' : 'opacity-0']"
                    src="/play.svg" alt="" aria-hidden="true" role="presentation"
                  />
                </button>
                <!-- wichtig: Wrapper mit End-Handler -->
                <audio :ref="el => registerAudioWithEnd(item.id, el)" :src="item.spotifyPreviewUrl" />
              </div>

              <button
                :class="[
                  'rounded-full w-7 h-7 flex items-center justify-center',
                  isUserFavorite ? 'bg-[#242424] bg-opacity-50' : 'bg-[#242424] bg-opacity-50',
                ]"
                @click.stop.prevent="() => usersStore.toggleFavoriteConcert(item.id)"
                :aria-pressed="isUserFavorite"
                :aria-label="isUserFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
              >
                <NuxtImg
                  v-if="isUserFavorite"
                  class="w-4 h-4 mt-[1px] transform transition-transform duration-300 hover:scale-110"
                  src="/heart_default.svg" alt="" aria-hidden="true" role="presentation"
                />
                <NuxtImg
                  v-else
                  class="w-4 h-4 mt-[1px] transform transition-transform duration-300 hover:scale-110"
                  src="/heart.svg" alt="" aria-hidden="true" role="presentation"
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
      class="lg:hidden flex flex-1 flex-col bg-[#242424] rounded-xl relative mb-5 lg:mb-0
             outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
      role="link"
      :aria-label="cardAriaLabel"
      tabindex="0"
      @keydown="onCardKeydown($event, item.slug)"
      @click="() => router.push(`/concerts/${item.slug}`)"
    >
      <NuxtLink
        :to="`/concerts/${item.slug}`"
        class="relative block rounded-t-xl outline-none
               focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
      >
        <!-- Badge vorläufig komplett ausblenden -->
        <span
          v-if="heroAltPayload"
          class="hidden absolute bottom-0 left-0 z-10 text-[10px] leading-none px-2 py-1
                bg-black/60 text-white/80 rounded-tr pointer-events-none"
        >
          {{ heroAltPayload }}
        </span>

        <AtomMedia
          v-if="item.heroImage || (item.artist.length > 0 && item.artist[0].heroImage)"
          v-bind="item.heroImage || (item.artist.length > 0 && item.artist[0].heroImage)"
          :isCover="true"
          :alt="heroAltPayload || heroAltFallback"
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
            :aria-pressed="isUserFavorite"
            :aria-label="isUserFavorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'"
          >
            <NuxtImg v-if="isUserFavorite" class="w-4 h-4 mt-[1px]" src="/heart_default.svg" alt="" aria-hidden="true" role="presentation" />
            <NuxtImg
              v-else
              class="w-4 h-4 mt-[1px] transform transition-transform duration-300 hover:scale-110"
              src="/heart_active.svg" alt="" aria-hidden="true" role="presentation"
            />
          </button>

          <div v-if="item.spotifyPreviewUrl" class="absolute right-11 dynamicElementHeight flex items-center justify-center">
            <button
              @click.stop="toggleAudio(item.id)"
              class="w-7 h-7 rounded-full bg-[#242424] flex items-center justify-center"
              :aria-label="isPlayingUi(item.id) ? 'Vorschau stoppen' : 'Vorschau abspielen'"
            >
              <NuxtImg
                :class="['w-3 h-3 absolute transition-opacity duration-300 ease-in-out', isPlayingUi(item.id) ? 'opacity-100' : 'opacity-0']"
                src="/stop.svg" alt="" aria-hidden="true" role="presentation"
              />
              <NuxtImg
                :class="['ml-1 w-4 h-4 absolute transition-opacity duration-300 ease-in-out', !isPlayingUi(item.id) ? 'opacity-100' : 'opacity-0']"
                src="/play.svg" alt="" aria-hidden="true" role="presentation"
              />
            </button>
            <!-- wichtig: Wrapper mit End-Handler -->
            <audio :ref="el => registerAudioWithEnd(item.id, el)" :src="item.spotifyPreviewUrl" />
          </div>

          <h4 v-if="item.name" class="text-lg text-text mb-2">{{ item.name }}</h4>
          <p v-if="item.subtitle" class="text-sm text-white opacity-50 overflow-hidden dynamicLineHeight1">
            {{ truncateSubtitle(item.subtitle) }}
          </p>
        </div>

        <div class="flex items-end text-white text-xs">
          <div class="w-1/2 p-3 pb-4">
            <div class="flex">
              <NuxtImg class="w-4 h-4" src="/calendar.svg" alt="" aria-hidden="true" role="presentation" />
              <p v-if="item.date" class="ml-1 opacity-40">
                <span :class="isToday(item.date) ? 'underline decoration-orange-500 underline-offset-2' : ''">
                  {{ weekDay(item.date) }}
                </span>,
                {{ formattedDate(item.date) }}
              </p>
            </div>
            <div>
              <NuxtLink :to="`/locations/${item.venue.slug}`" v-if="item.venue">
                <div class="flex my-4">
                  <NuxtImg class="w-4 h-4" src="/location.svg" alt="" aria-hidden="true" role="presentation" />
                  <p class="ml-1 opacity-40">{{ item.venue.name }}</p>
                </div>
              </NuxtLink>
            </div>
            <div class="flex">
              <NuxtImg class="w-4 h-4" src="/music.svg" alt="" aria-hidden="true" role="presentation" />
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
              {{ item.price }}<span v-if="showEuroSymbol"> €</span>
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
import { computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAudioManager } from '@/composables/useAudioManager'

const props = defineProps({ item: Object })
const router = useRouter()
const usersStore = useUserStore()
const { registerAudio, toggleAudio, isPlaying } = useAudioManager()

const isUserFavorite = computed(() =>
  usersStore.user.favoriteConcerts.includes(props.item.id)
)

/** UI-Flag für „per ended gestoppt“ */
const endedFlags = ref({}) // Record<string, boolean>
const markEnded = (id) => { endedFlags.value[id] = true }
const clearEnded = (id) => { if (endedFlags.value[id]) delete endedFlags.value[id] }
/** UI-Playing = Composable-Playing UND nicht „ended“ geflaggt */
const isPlayingUi = (id) => isPlaying(id) && !endedFlags.value[id]

/** Ref-Wrapper: registriert zusätzlich 'ended' und 'play' */
function registerAudioWithEnd(id, el) {
  registerAudio(id, el)
  if (!el) return

  // alte Listener sauber entfernen
  if (el.__phmEndedHandler) el.removeEventListener('ended', el.__phmEndedHandler)
  if (el.__phmPlayHandler) el.removeEventListener('play', el.__phmPlayHandler)

  el.__phmEndedHandler = () => {
    // Zeit resetten, sicherheitshalber pausieren
    try { el.currentTime = 0 } catch {}
    try { el.pause?.() } catch {}
    // Composable via künstlichem 'pause' informieren (falls es auf 'pause' hört)
    try { el.dispatchEvent(new Event('pause')) } catch {}
    // UI-Flag setzen, damit Icons sicher zurückspringen
    markEnded(id)
  }
  el.__phmPlayHandler = () => {
    // sobald wieder abgespielt wird, Flag löschen
    clearEnded(id)
  }

  el.addEventListener('ended', el.__phmEndedHandler)
  el.addEventListener('play', el.__phmPlayHandler)
}

/* Alt aus Payload (heroImage oder artist[0].heroImage) */
const heroAltPayload = computed(() =>
  props.item?.heroImage?.alt ||
  props.item?.artist?.[0]?.heroImage?.alt ||
  ''
)

/* Fallback alt */
const heroAltFallback = computed(() => {
  const n = props.item?.name || props.item?.artist?.[0]?.name
  return n ? `${n} – Konzertbild` : 'Konzertbild'
})

/* Client-Flag für korrekte Lokalzeit-Checks */
const isClient = ref(false)
const now = ref(new Date())
onMounted(() => { isClient.value = true; now.value = new Date() })

/* YYYY-MM-DD als lokale Mitternacht parsen (statt UTC) */
function parseLocalDate(dateStr) {
  if (!dateStr) return new Date(NaN)
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr)
  if (m) return new Date(+m[1], +m[2] - 1, +m[3])
  return new Date(dateStr)
}

function isToday(dateStr) {
  const d = parseLocalDate(dateStr)
  const t = now.value // reactive: triggers re-render after mount without user input
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  )
}

/* ARIA Label für die ganze Karte */
const cardAriaLabel = computed(() => {
  const title = props.item?.name ?? 'Konzert'
  const date = props.item?.date ? `${weekDay(props.item.date)}, ${formattedDate(props.item.date)}` : ''
  return date ? `${title} – ${date} öffnen` : `${title} öffnen`
})

/* Keyboard: Enter/Space -> Route, aber nicht wenn auf Links/Buttons */
function onCardKeydown(e, slug) {
  const key = e.key
  if (key !== 'Enter' && key !== ' ') return
  if (e.target.closest('a, button, [role="button"], [tabindex="-1"], input, textarea, select')) return
  e.preventDefault()
  router.push(`/concerts/${slug}`)
}

// --- Wochentag abgekürzt, ohne Punkt; „Heute“ als Sonderfall (clientseitig)
function weekDay(dateStr) {
  const d = parseLocalDate(dateStr)
  if (isNaN(d)) return ''
  if (isToday(dateStr)) return 'Heute'
  const abbr = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] // 0 = Sonntag
  return abbr[d.getDay()]
}

// --- dd.MM.yyyy
function formattedDate(dateStr) {
  const d = parseLocalDate(dateStr)
  if (isNaN(d)) return ''
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).toString().padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}.${mm}.${yyyy}`
}

// Preislogik
const showPrice = computed(() => {
  const price = props.item?.price
  return price !== null && price !== undefined && price !== ''
})

const showEuroSymbol = computed(() => {
  const price = props.item?.price
  if (!price) return false

  const normalized = price.toString().replace(/\s/g, '').toLowerCase()
  const excludedTerms = ['ausverkauft', 'tba', 'nurabendkasse', 'eintrittaufspendenbasis', 'eintrittfrei!', 'konzert:5', 'konzert: 5 ', 'eintrittkonzert:5']
  const containsExcluded = excludedTerms.some(term => normalized.includes(term))
  const alreadyHasEuro = normalized.includes('€')

  return !containsExcluded && !alreadyHasEuro
})

const showFeeHint = computed(() => {
  const price = props.item?.price
  if (!price) return false

  const normalized = price.toString().replace(/\s/g, '').toLowerCase()
  const excludedTerms = ['ausverkauft', 'tba', 'nurabendkasse', 'eintrittaufspendenbasis', 'eintrittfrei!', 'konzert:5', 'konzert: 5 ', 'eintrittkonzert:5']
  return !excludedTerms.some(term => normalized.includes(term))
})
</script>
