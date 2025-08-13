<template>
  <div
    class="sticky top-0 z-50 w-full"
    :class="{
      'bg-[#131313] transition-all duration-300 ease-in-out': true, 
      'transform translate-y-[-100%]': !isVisible,
    }"
  >
    <!-- Grid -->
    <DefaultGrid :no-spacing="true" class="relative grid items-center mb-4 mt-4">
      <!-- Logo -->
      <div class="flex items-end xl:col-start-1 xl:col-end-4">
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

      <!-- Suche: auf Unterseiten /concerts/* deaktiviert -->
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
          class="block p-4 w-full z-0 text-sm rounded text-gray-900 bg-text rounded-e-lg border-s-gray-50 border-s-2 border border-gray-300 focus:ring-primary focus:border-primary focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
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
        <button
          type="submit"
          :disabled="searchDisabled"
          :aria-disabled="searchDisabled ? 'true' : 'false'"
          class="absolute top-0 end-0 w-[54px] flex justify-center items-center text-sm font-medium h-full text-white bg-primary rounded-r border border-primary hover:bg-primary focus:ring-4 focus:outline-none focus:ring-primary dark:bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Suchen"
        >
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
          </svg>
          <span class="sr-only">Search</span>
        </button>
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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { user } = useUserStore()

// --- Suche deaktivieren auf Unterseiten /concerts/*
const searchDisabled = computed(() => {
  const p = route.path || ''
  return p.startsWith('/concerts/') && p !== '/concerts'
})

// --- Suche: lokale State + URL-Sync (debounced, min length, IME-sicher) ---
const localSearchQuery = ref('')
const isComposing = ref(false) // während Umlaut/IME-Eingabe keine Route-Updates

const MIN_QUERY_LEN = 2
const DEBOUNCE_MS = 400

const getQueryString = (q) => (Array.isArray(q) ? q[0] : (q ?? ''))

onMounted(() => {
  localSearchQuery.value = getQueryString(route.query.q)
})

watch(() => route.query.q, (q) => {
  const incoming = getQueryString(q)
  if (incoming !== localSearchQuery.value) {
    localSearchQuery.value = incoming
  }
})

function debounce(fn, wait) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}

const pushQueryDebounced = debounce((newQuery) => {
  const current = getQueryString(route.query.q)
  const q = (newQuery || '').trim()

  const nextQuery = { ...route.query }
  if (q && q.length >= MIN_QUERY_LEN) nextQuery.q = q
  else delete nextQuery.q

  if (q === current) return
  router.replace({ query: nextQuery })
}, DEBOUNCE_MS)

watch(localSearchQuery, (newQuery) => {
  if (searchDisabled.value) return
  if (isComposing.value) return // IME: erst nach compositionend
  pushQueryDebounced(newQuery)
})

// IME fertig -> sofort den letzten Stand übernehmen (ohne extra Tastendruck)
const onCompositionEnd = (e) => {
  isComposing.value = false
  pushQueryDebounced(e.target?.value ?? localSearchQuery.value)
}

const onSubmit = () => {
  if (searchDisabled.value) return
  // Optional: bei Enter sofort schreiben (ohne Debounce)
  const q = (localSearchQuery.value || '').trim()
  const nextQuery = { ...route.query }
  if (q && q.length >= MIN_QUERY_LEN) nextQuery.q = q
  else delete nextQuery.q
  router.replace({ query: nextQuery })
}

const clearSearch = () => { localSearchQuery.value = '' }

// --- StickyNavigation Logic ---
const isVisible = ref(true)
let lastScroll = 0

const handleScroll = () => {
  const currentScroll = window.scrollY
  if (currentScroll > lastScroll && currentScroll > 50) {
    isVisible.value = false
  } else if (currentScroll < lastScroll || currentScroll <= 50) {
    isVisible.value = true
  }
  lastScroll = currentScroll <= 0 ? 0 : currentScroll
}

onMounted(() => { window.addEventListener('scroll', handleScroll, { passive: true }) })
onUnmounted(() => { window.removeEventListener('scroll', handleScroll) })

const terms = computed(() => {
  const qs = normalize(qString.value)
  if (qs.length < 2) return []   // <- erst ab 2 Zeichen filtern
  return qs.split(/\s+/).filter(Boolean)
})
</script>
