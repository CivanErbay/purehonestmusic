<template>
  <DefaultGrid :no-spacing="true">
    <div
      class="xl:col-start-2 xl:col-end-11 flex flex-row flex-wrap items-center mb-6 mt-6"
    >
      <!-- Label -->
      <div class="text-2xl mr-3 sm:mr-4 md:mr-8 xl:mr-12 flex-none shrink-0 max-[414px]:hidden">
        Filter:
      </div>

      <!-- Dropdown-Container -->
      <div class="flex flex-row flex-wrap items-center gap-2 sm:gap-4 my-6 lg:my-0 relative">
        <ItemsDropdown
          title="Location"
          class="font-medium"
          slug="venues"
          :items="filters.venues"
          :open="openDropdown === 'venues'"
          @update:selected-items="handleSelectedItem"
          @update:toggle="handleDropdownToggle"
        />
        <ItemsDropdown
          title="Musikgenre"
          class="font-medium"
          slug="genres"
          :items="filters.genres"
          :open="openDropdown === 'genres'"
          @update:selected-items="handleSelectedItem"
          @update:toggle="handleDropdownToggle"
        />
        <!-- ggf. weitere Dropdowns -->
      </div>

      <!-- Clear-Button -->
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
</template>


<script setup>
import { reactive, watch, ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  venues: { type: Array, default: () => [] },     // bleiben ungenutzt, falls vorhanden ok
  genres: { type: Array, default: () => [] },
  promoters: { type: Array, default: () => [] },
});

const route = useRoute();
const router = useRouter();
const concertStore = useConcertStore();

const openDropdown = ref(null);
const handleDropdownToggle = (dropdown) => {
  openDropdown.value = openDropdown.value === dropdown ? null : dropdown;
};

/* ---------------- Suche (?q=...) + Normalisierung ---------------- */
const qString = computed(() => {
  const q = route.query.q;
  return Array.isArray(q) ? q[0] : (q ?? '');
});

const normalize = (s) =>
  (s ?? '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .trim();

const terms = computed(() => normalize(qString.value).split(/\s+/).filter(Boolean));

const matchesText = (item) => {
  if (!terms.value.length) return true;
  const hay = normalize([
    item?.name,
    item?.subtitle,
    Array.isArray(item?.artist) ? item.artist.map(a => a?.name).join(' ') : item?.artist?.name,
    item?.venue?.name,
    Array.isArray(item?.genres) ? item.genres.map(g => g?.name).join(' ') : item?.genres,
    item?.promoter?.name,
    item?.slug
  ].filter(Boolean).join(' '));
  return terms.value.every(t => hay.includes(t));
};

/* ---------------- Auswahl aus URL ---------------- */
const selectedVenues = computed(() =>
  route.query.venues ? route.query.venues.split(',').filter(Boolean) : []
);
const selectedPromoters = computed(() =>
  route.query.promoters ? route.query.promoters.split(',').filter(Boolean) : []
);
// Genres nutzen Namen statt Slug
const selectedGenres = computed(() =>
  route.query.genres ? route.query.genres.split(',').filter(Boolean) : []
);

/* ---------------- Basisitems (>= heute, optional ?date=) + Textsuche ---------------- */
const baseItems = computed(() => {
  const today = new Date(); today.setHours(0,0,0,0);
  const selectedDate = route.query.date;
  let list = (concertStore.concerts ?? []).filter(it => new Date(it.date) >= today);
  if (selectedDate) {
    list = list.filter(it => new Date(it.date).toISOString().split('T')[0] === selectedDate);
  }
  return terms.value.length ? list.filter(matchesText) : list;
});

/* ---------------- Facetten anwenden (AND mit anderen, OHNE sich selbst) ---------------- */
const applyFacets = (items, { withVenues=true, withPromoters=true, withGenres=true } = {}) => {
  return items.filter((it) => {
    const venueOk    = !withVenues    || selectedVenues.value.length === 0    || selectedVenues.value.includes(it.venue?.slug);
    const promoterOk = !withPromoters || selectedPromoters.value.length === 0 || selectedPromoters.value.includes(it.promoter?.slug);
    const genreOk    = !withGenres    || selectedGenres.value.length === 0    ||
      selectedGenres.value.some(g => (it.genres || []).map(x => x.name).includes(g));
    return venueOk && promoterOk && genreOk;
  });
};

// Items-Mengen je Facette
const itemsForLocationOptions = computed(() => applyFacets(baseItems.value, { withVenues:false, withPromoters:true,  withGenres:true  }));
const itemsForPromoterOptions = computed(() => applyFacets(baseItems.value, { withVenues:true,  withPromoters:false, withGenres:true  }));
const itemsForGenreOptions    = computed(() => applyFacets(baseItems.value, { withVenues:true,  withPromoters:true,  withGenres:false }));

/* ---------------- Optionen mit Count & Selected ---------------- */
const filters = reactive({
  venues: [],
  genres: [],
  promoters: [],
});

const buildFilters = () => {
  // Venues
  const venueScoped = applyFacets(baseItems.value, { withVenues:false, withPromoters:true, withGenres:true });
  const venueCounts = new Map();
  for (const it of venueScoped) {
    const slug = it.venue?.slug;
    if (!slug) continue;
    venueCounts.set(slug, (venueCounts.get(slug) || 0) + 1);
  }
  const venueMap = new Map();
  for (const it of venueScoped) {
    if (it.venue?.slug) venueMap.set(it.venue.slug, it.venue.name);
  }
  filters.venues = [...venueCounts.entries()]
    .map(([slug, count]) => ({
      name: venueMap.get(slug),
      slug,
      selected: selectedVenues.value.includes(slug),
      count,
    }))
    .filter(v => v.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));

  // Promoters
  const promScoped = applyFacets(baseItems.value, { withVenues:true, withPromoters:false, withGenres:true });
  const promCounts = new Map();
  const promMap = new Map();
  for (const it of promScoped) {
    const slug = it.promoter?.slug;
    if (!slug) continue;
    promCounts.set(slug, (promCounts.get(slug) || 0) + 1);
    promMap.set(slug, it.promoter.name);
  }
  filters.promoters = [...promCounts.entries()]
    .map(([slug, count]) => ({
      name: promMap.get(slug),
      slug,
      selected: selectedPromoters.value.includes(slug),
      count,
    }))
    .filter(p => p.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));

  // Genres (value = Name)
  const genreScoped = applyFacets(baseItems.value, { withVenues:true, withPromoters:true, withGenres:false });
  const genreCounts = new Map();
  for (const it of genreScoped) {
    for (const g of (it.genres || [])) {
      if (!g?.name) continue;
      const key = g.name;
      genreCounts.set(key, (genreCounts.get(key) || 0) + 1);
    }
  }
  filters.genres = [...genreCounts.entries()]
    .map(([name, count]) => ({
      name,
      slug: name, // Genres benutzen Namen in der URL
      selected: selectedGenres.value.includes(name),
      count,
    }))
    .filter(g => g.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));
};

// initial + bei Änderungen neu berechnen
watch(
  () => [
    concertStore.concerts,
    route.query.q,
    route.query.date,
    route.query.venues,
    route.query.promoters,
    route.query.genres,
  ],
  buildFilters,
  { immediate: true }
);

/* ---------------- Route-Query Helper + Pruning ---------------- */
const replaceQuery = (next) => router.replace({ query: next });

const pruneIfNeeded = () => {
  const next = { ...route.query };

  const allowedVenues = new Set(filters.venues.map(v => v.slug));
  const allowedProms  = new Set(filters.promoters.map(p => p.slug));
  const allowedGenres = new Set(filters.genres.map(g => g.slug));

  const prune = (val, allowed) => {
    if (!val) return null;
    const arr = val.split(',').filter(Boolean).filter(v => allowed.has(v));
    return arr.length ? arr.join(',') : null;
  };

  const prunedVenues    = prune(route.query.venues,    allowedVenues);
  const prunedPromoters = prune(route.query.promoters, allowedProms);
  const prunedGenres    = prune(route.query.genres,    allowedGenres);

  let changed = false;
  if (prunedVenues !== (route.query.venues ?? null))   { changed = true; if (prunedVenues) next.venues = prunedVenues; else delete next.venues; }
  if (prunedPromoters !== (route.query.promoters ?? null)) { changed = true; if (prunedPromoters) next.promoters = prunedPromoters; else delete next.promoters; }
  if (prunedGenres !== (route.query.genres ?? null))   { changed = true; if (prunedGenres) next.genres = prunedGenres; else delete next.genres; }

  if (changed) replaceQuery(next);
};

watch(
  () => [filters.venues, filters.promoters, filters.genres],
  pruneIfNeeded,
  { deep: true }
);

/* ---------------- Aktive Filter-Anzeige ---------------- */
const activeFilter = computed(
  () =>
    route.query.venues ||
    route.query.genres ||
    route.query.promoters ||
    route.query.date
);

/* ---------------- Auswahl-Handler ---------------- */
const handleSelectedItem = (category, selectedItem) => {
  const query = { ...route.query };
  const selectedItems = query[category] ? query[category].split(',') : [];

  const key = selectedItem.slug;
  const idx = selectedItems.indexOf(key);
  if (idx >= 0) selectedItems.splice(idx, 1);
  else selectedItems.push(key);

  if (selectedItems.length > 0) query[category] = selectedItems.join(',');
  else delete query[category];

  router.push({ query });
};

const handleClearFilter = () => {
  concertStore.resetShowUntilDaysFromNow?.();
  router.push({ query: {} });
};

const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown')) {
    openDropdown.value = null;
  }
};
onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.cleartBtn {
  padding: 19px;
  border: 0.5px;
  border-top-style: none;
  border-right-style: none;
  border-bottom-style: none;
  border-left-style: none;
  border-style: solid;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem 1rem 1.5rem;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: #fff;
  cursor: pointer;
}
.cleartBtn:hover { background-color: #e0e0e0; color: #000; }
</style>
