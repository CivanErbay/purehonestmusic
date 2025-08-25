<template>
  <DefaultGrid :no-spacing="true">
    <!-- ⬇️ Anker + z-Boost wenn irgendwas offen ist -->
    <div
      ref="filtersAnchor"
      class="xl:col-start-2 xl:col-end-12 flex flex-row flex-wrap items-center mb-8 mt-10"
      :class="overlayVisible ? 'relative z-[240]' : ''"
    >
      <div class="text-2xl mr-3 sm:mr-4 md:mr-8 xl:mr-12 flex-none shrink-0 max-[414px]:hidden">
        Filter:
      </div>

      <div class="filters-hs-wrap flex-1 min-w-0" ref="wrap" @scroll.passive="onHorizontalScroll">
        <ul class="filters-hs">
          <li>
            <ItemsDatepicker
              class="font-medium"
              slug="date"
              :selected-date="route.query.date || ''"
              :open="openDropdown === 'date'"
              :available-dates="availableDates"
              @update:toggle="toggleDropdown"
              @update:date="handleDateUpdate"
              @confirm="handleConfirm"
            />
          </li>

          <li>
            <ItemsDropdown
              title="Location"
              class="font-medium"
              slug="venues"
              :items="filters.venues"
              :open="openDropdown === 'venues'"
              @update:selected-items="handleSelectedItem"
              @update:toggle="toggleDropdown"
              @confirm="handleConfirm"
            />
          </li>

          <li>
            <ItemsDropdown
              title="Musikgenre"
              class="font-medium"
              slug="genres"
              :items="filters.genres"
              :open="openDropdown === 'genres'"
              @update:selected-items="handleSelectedItem"
              @update:toggle="toggleDropdown"
              @confirm="handleConfirm"
            />
          </li>

          <li>
            <ItemsDropdown
              title="Veranstaltende"
              class="font-medium"
              slug="promoters"
              :items="filters.promoters"
              :open="openDropdown === 'promoters'"
              @update:selected-items="handleSelectedItem"
              @update:toggle="toggleDropdown"
              @confirm="handleConfirm"
            />
          </li>
        </ul>
      </div>

      <div
        v-if="activeFilter"
        class="cleartBtn text-center order-last w-full sm:w-full sm:ml-0
               lg:w-auto lg:ml-4 lg:order-none lg:inline-flex lg:items-center lg:justify-center"
        @click="handleClearFilter"
      >
        Filter zurücksetzen
      </div>
    </div>
  </DefaultGrid>

  <!-- Blur-Overlay (unter Dropdowns, über Content) -->
  <teleport to="body">
    <transition name="overlay-fade">
      <div
        v-if="overlayVisible"
        class="phm-overlay"
        role="presentation"
        aria-hidden="true"
        @click="closeAll"
      />
    </transition>
  </teleport>
</template>

<script setup>
import { reactive, watch, ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const concertStore = useConcertStore?.()

/* Overlay ist sichtbar, wenn ein Dropdown offen ist */
const openDropdown = ref(null)
const overlayVisible = computed(() => !!openDropdown.value)

const closeAll = () => { openDropdown.value = null }

/* Smooth zum Filterblock scrollen (mobil) */
const filtersAnchor = ref(null)
const scrollFiltersIntoView = () => {
  if (window.innerWidth >= 640) return
  const anchor = filtersAnchor.value
  if (!anchor) return
  const nav = document.querySelector('.full-bleed')
  const navH = (nav?.offsetHeight || 64) + 6
  const rect = anchor.getBoundingClientRect()
  if (rect.top > navH + 4) {
    const target = window.scrollY + rect.top - navH
    window.scrollTo({ top: target, behavior: 'smooth' })
  }
}

const toggleDropdown = async (slug) => {
  const willOpen = openDropdown.value !== slug
  openDropdown.value = willOpen ? slug : null
  if (willOpen) { await nextTick(); scrollFiltersIntoView() }
}
const handleConfirm = () => { closeAll() }

/* Horizontaler Scroll schließt Dropdowns */
const wrap = ref(null)
let lastLeft = 0
const onHorizontalScroll = () => {
  const el = wrap.value; if (!el) return
  const dx = Math.abs(el.scrollLeft - lastLeft)
  lastLeft = el.scrollLeft
  if (dx > 8) closeAll()
}

/* ----------------- Suche / Filter-Logik (unverändert) ----------------- */
const qString = computed(() => Array.isArray(route.query.q) ? route.query.q[0] : (route.query.q ?? ''))
const normalize = (s) =>
  (s ?? '').toString().normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')
    .replace(/Ä/g,'Ae').replace(/Ö/g,'Oe').replace(/Ü/g,'Ue').replace(/ß/g,'ss')
    .toLowerCase().trim()
const terms = computed(() => normalize(qString.value).split(/\s+/).filter(Boolean))

const matchesText = (item) => {
  if (!terms.value.length) return true
  const hay = normalize([
    item?.name, item?.subtitle,
    Array.isArray(item?.artist) ? item.artist.map(a => a?.name).join(' ') : item?.artist?.name,
    item?.venue?.name,
    Array.isArray(item?.genres) ? item.genres.map(g => g?.name).join(' ') : item?.genres,
    item?.promoter?.name, item?.slug
  ].filter(Boolean).join(' '))
  return terms.value.every(t => hay.includes(t))
}

const selectedVenues    = computed(() => route.query.venues    ? route.query.venues.split(',').filter(Boolean)    : [])
const selectedPromoters = computed(() => route.query.promoters ? route.query.promoters.split(',').filter(Boolean) : [])
const selectedGenres    = computed(() => route.query.genres    ? route.query.genres.split(',').filter(Boolean)    : [])

const baseItems = computed(() => {
  const today = new Date(); today.setHours(0,0,0,0)
  const selectedDate = route.query.date
  let list = (concertStore?.concerts ?? []).filter(it => new Date(it.date) >= today)
  if (selectedDate) list = list.filter(it => new Date(it.date).toISOString().split('T')[0] === selectedDate)
  return terms.value.length ? list.filter(matchesText) : list
})
const baseItemsNoDate = computed(() => {
  const today = new Date(); today.setHours(0,0,0,0)
  let list = (concertStore?.concerts ?? []).filter(it => new Date(it.date) >= today)
  return terms.value.length ? list.filter(matchesText) : list
})
const applyFacets = (items, { withVenues=true, withPromoters=true, withGenres=true } = {}) =>
  items.filter((it) => {
    const venueOk    = !withVenues    || selectedVenues.value.length === 0    || selectedVenues.value.includes(it.venue?.slug)
    const promoterOk = !withPromoters || selectedPromoters.value.length === 0 || selectedPromoters.value.includes(it.promoter?.slug)
    const genreOk    = !withGenres    || selectedGenres.value.length === 0    ||
      selectedGenres.value.some(g => (it.genres || []).map(x => x.name).includes(g))
    return venueOk && promoterOk && genreOk
  })

const itemsForLocationOptions = computed(() => applyFacets(baseItems.value, { withVenues:false, withPromoters:true,  withGenres:true  }))
const itemsForPromoterOptions = computed(() => applyFacets(baseItems.value, { withVenues:true,  withPromoters:false, withGenres:true  }))
const itemsForGenreOptions    = computed(() => applyFacets(baseItems.value, { withVenues:true,  withPromoters:true,  withGenres:false }))

const calendarScoped = computed(() => applyFacets(baseItemsNoDate.value, { withVenues:true, withPromoters:true, withGenres:true }))
const availableDates = computed(() => {
  const set = new Set()
  for (const it of calendarScoped.value) set.add(new Date(it.date).toISOString().split('T')[0])
  return Array.from(set)
})

const filters = reactive({ venues: [], genres: [], promoters: [] })
const buildFilters = () => {
  const venueScoped = applyFacets(baseItems.value, { withVenues:false, withPromoters:true, withGenres:true })
  const venueCounts = new Map(); const venueMap = new Map()
  for (const it of venueScoped) { const s = it.venue?.slug; if (s){ venueCounts.set(s,(venueCounts.get(s)||0)+1); venueMap.set(s,it.venue.name) } }
  filters.venues = [...venueCounts.entries()].map(([slug,count]) => ({
    name: venueMap.get(slug), slug, selected: selectedVenues.value.includes(slug), count,
  })).filter(v=>v.count>0).sort((a,b)=>a.name.localeCompare(b.name,'de',{sensitivity:'base'}))

  const promScoped = applyFacets(baseItems.value, { withVenues:true, withPromoters:false, withGenres:true })
  const promCounts = new Map(); const promMap = new Map()
  for (const it of promScoped) { const s = it.promoter?.slug; if (s){ promCounts.set(s,(promCounts.get(s)||0)+1); promMap.set(s,it.promoter.name) } }
  filters.promoters = [...promCounts.entries()].map(([slug,count]) => ({
    name: promMap.get(slug), slug, selected: selectedPromoters.value.includes(slug), count,
  })).filter(p=>p.count>0).sort((a,b)=>a.name.localeCompare(b.name,'de',{sensitivity:'base'}))

  const genreScoped = applyFacets(baseItems.value, { withVenues:true, withPromoters:true, withGenres:false })
  const genreCounts = new Map()
  for (const it of genreScoped) for (const g of (it.genres||[])) if (g?.name) genreCounts.set(g.name, (genreCounts.get(g.name)||0)+1)
  filters.genres = [...genreCounts.entries()].map(([name,count]) => ({
    name, slug:name, selected: selectedGenres.value.includes(name), count,
  })).filter(g=>g.count>0).sort((a,b)=>a.name.localeCompare(b.name,'de',{sensitivity:'base'}))
}
watch(() => [
  concertStore?.concerts, route.query.q, route.query.date, route.query.venues, route.query.promoters, route.query.genres,
], buildFilters, { immediate:true })

const replaceQuery = (next) => router.replace({ query: next })
const pruneIfNeeded = () => {
  const next = { ...route.query }
  const allowedVenues = new Set(filters.venues.map(v=>v.slug))
  const allowedProms  = new Set(filters.promoters.map(p=>p.slug))
  const allowedGenres = new Set(filters.genres.map(g=>g.slug))
  const prune = (val, allowed) => !val ? null : (val.split(',').filter(Boolean).filter(v=>allowed.has(v))).join(',') || null
  const pv = prune(route.query.venues, allowedVenues)
  const pp = prune(route.query.promoters, allowedProms)
  const pg = prune(route.query.genres, allowedGenres)
  let changed = false
  if (pv !== (route.query.venues ?? null))      { changed = true; if (pv) next.venues = pv; else delete next.venues }
  if (pp !== (route.query.promoters ?? null))   { changed = true; if (pp) next.promoters = pp; else delete next.promoters }
  if (pg !== (route.query.genres ?? null))      { changed = true; if (pg) next.genres = pg; else delete next.genres }
  if (changed) replaceQuery(next)
}
watch(() => [filters.venues, filters.promoters, filters.genres], pruneIfNeeded, { deep:true })

const activeFilter = computed(() =>
  route.query.venues || route.query.genres || route.query.promoters || route.query.date
)

const handleSelectedItem = (category, selectedItem) => {
  const query = { ...route.query }
  const arr = query[category] ? query[category].split(',') : []
  const key = selectedItem.slug
  const idx = arr.indexOf(key)
  if (idx >= 0) arr.splice(idx, 1); else arr.push(key)
  if (arr.length > 0) query[category] = arr.join(','); else delete query[category]
  router.push({ query })
}
const handleDateUpdate = (isoDate) => {
  const query = { ...route.query }
  if (isoDate) query.date = isoDate; else delete query.date
  router.push({ query })
}
const handleClearFilter = () => {
  concertStore?.resetShowUntilDaysFromNow?.()
  router.push({ query: {} })
}

const handleClickOutside = (event) => { if (!event.target.closest('.dropdown')) closeAll() }
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.filters-hs-wrap{
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  width: 100%;
  padding-bottom: 2px;
  position: relative;
  touch-action: pan-x;
}
.filters-hs{
  --gutter: .5rem; --edge: .75rem;
  display: inline-grid; grid-auto-flow: column; grid-auto-columns: max-content;
  gap: var(--gutter); vertical-align: top;
}
.filters-hs::before, .filters-hs::after{ content: ''; width: var(--edge); }
.filters-hs > li{ list-style: none; scroll-snap-align: start; }

.cleartBtn{ border:.5px solid; border-radius:.5rem; padding:1rem 1.5rem; color:#fff; cursor:pointer; transition:background-color .3s,color .3s; }
.cleartBtn:hover{ background-color:#e0e0e0; color:#000; }

/* Overlay (unter Dropdowns, über Content) */
.phm-overlay{
  position: fixed; inset: 0;
  z-index: 220; /* Filterleiste/Drops z=240/230 */
  background-color: rgba(19,19,19,0.6);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}
.overlay-fade-enter-active, .overlay-fade-leave-active { transition: opacity .18s ease; }
.overlay-fade-enter-from, .overlay-fade-leave-to { opacity: 0; }
</style>
