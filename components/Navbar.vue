<template>
  <div
    ref="navRef"
    class="sticky top-0 z-[160] w-full py-0 will-change-[opacity,transform] full-bleed"
    :class="{
      'bg-[#131313]/60 backdrop-blur-[30px] transition-all duration-300 ease-in-out': true,
      'transform -translate-y-full': !isVisible,
    }"
    :style="{ WebkitBackdropFilter: 'blur(30px)' }"
  >
    <!-- Grid -->
    <DefaultGrid :no-spacing="true" class="relative grid items-center mb-4 mt-4">
      <!-- Logo -->
      <div class="flex items-end pb-2 lg:pb-0 xl:col-start-1 xl:col-end-4">
        <NuxtLink to="/" class="tracking-widest md:mt-0">
          <h1 class="text-lg logo dynamicLetterSpacingLogo">PURE.HONEST.MUSIC</h1>
          <h2 class="text-xs text-[#454545] w-max logo">ENTDECKE KONZERTE IN KÖLN</h2>
        </NuxtLink>
        <div class="md:hidden ml-auto">
          <NuxtLink to="/concerts/favorites" class="flex w-fit ml-auto items-center p-2 mt-[8px] bg-bg-light rounded-lg gap-4 tracking-widest">
            <div class="h-7 w-7 flex items-center justify-center rounded-full bg-[#E77000]">
              <NuxtImg class="w-4 h-4 mt-[1px] transform transition-transform duration-300 hover:scale-110" src="/heart_filled.svg" />
            </div>
            <div class="text-xl">
              {{ user?.favoriteConcerts?.length || 0 }}
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Suche -->
      <form
        class="hidden lg:block relative order-last md:order-none w-full md:col-start-4 md:col-end-10 xl:col-start-4 xl:col-end-11 xl:justify-self-center xl:max-w-[980px] my-1 min-w-0"
        :class="{ 'opacity-50': searchDisabled }"
        @submit.prevent="onSubmit"
        :aria-disabled="searchDisabled ? 'true' : 'false'"
      >
        <input
          v-model="localSearchQuery"
          type="search"
          id="search-dropdown"
          :disabled="searchDisabled"
          :readonly="searchDisabled"
          :title="searchDisabled ? 'Suche auf Unterseiten deaktiviert' : ''"
          class="search-input block p-4 w-full z-0 text-sm rounded text-gray-900 bg-text rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 pr-[110px]"
          placeholder="Suche nach Band / Künstler*in, Location oder Genre ..."
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          enterkeyhint="search"
          @keydown.esc.prevent="clearSearch"
          @compositionstart="isComposing = true"
          @compositionend="onCompositionEnd"
          aria-label="Suche nach Location oder Musikgenre"
        />

        <Transition name="fade-zoom">
          <button
            v-if="showClear"
            type="button"
            @click="clearSearch()"
            class="absolute top-0 right-[54px] h-full w-[40px] flex items-center justify-center z-10"
            :disabled="searchDisabled"
            aria-label="Suche zurücksetzen"
            title="Suche zurücksetzen"
          >
            <span
              class="inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-gray-400
                     transition-colors duration-200 ease-out
                     hover:bg-gray-400 hover:text-white hover:border-gray-400"
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </span>
          </button>
        </Transition>

        <div
          aria-hidden="true"
          tabindex="-1"
          @click.prevent
          @mousedown.prevent
          @mouseup.prevent
          @dblclick.prevent
          class="absolute top-0 end-0 w-[54px] h-full flex justify-center items-center
                 text-white bg-primary rounded-r border border-primary
                 select-none cursor-default"
        >
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
        </div>
      </form>

      <!-- Favoriten -->
      <div class="hidden md:block md:col-start-12 md:col-end-12">
        <NuxtLink to="/concerts/favorites" class="flex w-fit ml-auto items-center mt-2 mb-2 p-4 bg-bg-light rounded-lg gap-4 tracking-widest transform transition-transform duration-300 hover:scale-110">
          <div class="h-7 w-7 flex items-center justify-center rounded-full bg-[#E77000]">
            <NuxtImg class="w-4 h-4 mt-[1px]" src="/heart_filled.svg" />
          </div>
          <div class="text-xl">
            {{ user?.favoriteConcerts?.length || 0 }}
          </div>
        </NuxtLink>
      </div>
    </DefaultGrid>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { user } = useUserStore()

const searchDisabled = computed(() => {
  const p = route.path || ''
  return p.startsWith('/concerts/') && p !== '/concerts'
})

const localSearchQuery = ref('')
const isComposing = ref(false)
const MIN_QUERY_LEN = 2
const DEBOUNCE_MS = 400
const getQueryString = (q) => (Array.isArray(q) ? q[0] : (q ?? ''))

onMounted(() => { localSearchQuery.value = getQueryString(route.query.q) })
watch(() => route.query.q, (q) => {
  const incoming = getQueryString(q)
  if (incoming !== localSearchQuery.value) localSearchQuery.value = incoming
})
function debounce(fn, wait) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait) } }
const pushQueryDebounced = debounce((newQuery) => {
  const current = getQueryString(route.query.q)
  const q = (newQuery || '').trim()
  const nextQuery = { ...route.query }
  if (q && q.length >= MIN_QUERY_LEN) nextQuery.q = q; else delete nextQuery.q
  if (q === current) return
  router.replace({ query: nextQuery })
}, DEBOUNCE_MS)
watch(localSearchQuery, (newQuery) => { if (!searchDisabled.value && !isComposing.value) pushQueryDebounced(newQuery) })
const onCompositionEnd = (e) => { isComposing.value = false; pushQueryDebounced(e.target?.value ?? localSearchQuery.value) }
const onSubmit = () => {
  if (searchDisabled.value) return
  const q = (localSearchQuery.value || '').trim()
  const nextQuery = { ...route.query }
  if (q && q.length >= MIN_QUERY_LEN) nextQuery.q = q; else delete nextQuery.q
  router.replace({ query: nextQuery })
}
const showClear = computed(() => !searchDisabled.value && ((localSearchQuery.value || '').trim().length > 0))
const clearSearch = (focus = true) => {
  localSearchQuery.value = ''
  const nextQuery = { ...route.query }; delete nextQuery.q
  router.replace({ query: nextQuery })
  if (focus) { const el = document.getElementById('search-dropdown'); if (el) el.focus() }
}

/* ---------- Sticky-Offset als CSS-Variable setzen ---------- */
const navRef = ref(null)
const isVisible = ref(true)
let lastScroll = 0

const setStickyOffset = () => {
  const h = navRef.value?.offsetHeight || 64
  // Wenn Navbar sichtbar -> Offset = Höhe, sonst 0
  const val = isVisible.value ? `${h}px` : '0px'
  document.documentElement.style.setProperty('--sticky-offset', val)
}

const handleScroll = () => {
  const current = window.scrollY
  if (current > lastScroll && current > 50) {
    if (isVisible.value) { isVisible.value = false; setStickyOffset() }
  } else if (current < lastScroll || current <= 50) {
    if (!isVisible.value) { isVisible.value = true; setStickyOffset() }
  }
  lastScroll = current <= 0 ? 0 : current
}

onMounted(async () => {
  await nextTick()
  setStickyOffset()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', setStickyOffset, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', setStickyOffset)
})
</script>

<style>
/* Smooth Ein-/Ausblenden des Clear-Buttons */
.fade-zoom-enter-active,
.fade-zoom-leave-active { transition: opacity 250ms ease, transform 250ms ease; }
.fade-zoom-enter-from,
.fade-zoom-leave-to { opacity: 0; transform: scale(0.95); }
.fade-zoom-enter-to,
.fade-zoom-leave-from { opacity: 1; transform: scale(1); }

/* Native Browser-Clear-Buttons ausblenden */
.search-input::-webkit-search-cancel-button { -webkit-appearance: none; appearance: none; display: none; }
</style>
