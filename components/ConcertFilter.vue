<template>
  <DefaultGrid :no-spacing="true">
    <div class="xl:col-start-2 xl:col-end-12 flex flex-row flex-wrap items-start mb-6 mt-6">
      <!-- Linke Seite: Spalte (Filterzeile oben, Pills unten) -->
      <div class="flex-1 min-w-0 filters-unit">
        <!-- Filterzeile (Label + Buttons) bleibt über Overlay -->
        <div
          class="flex items-center min-w-0"
          :class="{ 'filters-elevated': !!openDropdown }"
        >
          <!-- Label: unter 1024px ausblenden -->
          <div class="hidden lg:block text-2xl mr-3 sm:mr-4 md:mr-8 xl:mr-8 flex-none shrink-0">
            Filter:
          </div>

          <!-- Horizontale Filter-Leiste: Wrapper scrollt -->
          <div
            class="filters-hs-wrap flex-auto min-w-0"
            ref="wrap"
            @scroll.passive="onHorizontalScroll"
          >
            <ul class="filters-hs">
              <!-- Datum -->
              <li>
                <ItemsDatepicker
                  class="font-medium"
                  slug="date"
                  :selected-date="route.query.date || ''"
                  :open="openDropdown === 'date'"
                  :available-dates="availableDates"
                  @update:toggle="toggleDropdown"
                  @update:date="handleDateUpdate"
                />
              </li>

              <!-- Location -->
              <li>
                <ItemsDropdown
                  title="Location"
                  class="font-medium"
                  slug="venues"
                  :items="filters.venues"
                  :open="openDropdown === 'venues'"
                  @update:selected-items="handleSelectedItem"
                  @update:toggle="toggleDropdown"
                />
              </li>

              <!-- Musikgenre -->
              <li>
                <ItemsDropdown
                  title="Musikgenre"
                  class="font-medium"
                  slug="genres"
                  :items="filters.genres"
                  :open="openDropdown === 'genres'"
                  @update:selected-items="handleSelectedItem"
                  @update:toggle="toggleDropdown"
                />
              </li>

              <!-- Veranstalter -->
              <li>
                <ItemsDropdown
                  title="Veranstalter"
                  class="font-medium"
                  slug="promoters"
                  :items="filters.promoters"
                  :open="openDropdown === 'promoters'"
                  @update:selected-items="handleSelectedItem"
                  @update:toggle="toggleDropdown"
                />
              </li>
            </ul>
          </div>
        </div>

        <!-- Aktive Filter-Pills (liegen NICHT über dem Overlay) -->
        <transition-group
          name="chip-fade"
          tag="ul"
          class="active-pills"
          role="list"
          v-if="activeChips.length"
        >
          <li
            v-for="chip in activeChips"
            :key="chip.key"
            class="chip"
            role="listitem"
          >
            <span class="chip-label">{{ chip.label }}</span>
            <button
              type="button"
              class="chip-close"
              :aria-label="`Filter entfernen: ${chip.label}`"
              @click="removeChip(chip)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="chip-x" aria-hidden="true">
                <path d="M14.348 5.652a.8.8 0 0 0-1.132 0L10 8.868 6.784 5.652a.8.8 0 1 0-1.132 1.132L8.868 10l-3.216 3.216a.8.8 0 1 0 1.132 1.132L10 11.132l3.216 3.216a.8.8 0 1 0 1.132-1.132L11.132 10l3.216-3.216a.8.8 0 0 0 0-1.132Z" fill="currentColor"/>
              </svg>
            </button>
          </li>
        </transition-group>

        <!-- MOBIL: Clear-Button NACH den Pills (hinter Overlay, da ohne z-index) -->
        <div
          v-if="activeFilter"
          class="cleartBtn lg:hidden w-full mt-4 text-center"
          @click="handleClearFilter"
        >
          Alle Filter zurücksetzen
        </div>
      </div>

      <!-- DESKTOP/Tablet ≥ lg: Clear rechts -->
      <div
        v-if="activeFilter"
        class="cleartBtn hidden lg:inline-flex lg:items-center lg:justify-center lg:ml-auto lg:w-auto flex-none"
        @click="handleClearFilter"
      >
        Alle Filter zurücksetzen
      </div>
    </div>

    <!-- Zentrales Overlay -->
    <teleport to="body">
      <transition name="phm-overlay-fade">
        <div
          v-if="openDropdown"
          class="phm-overlay"
          @click="openDropdown = null"
        ></div>
      </transition>
    </teleport>
  </DefaultGrid>
</template>

<script setup>
import { reactive, watch, ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const concertStore = useConcertStore?.();

/* Open-State für Dropdowns */
const openDropdown = ref(null);
const toggleDropdown = (slug) => {
  openDropdown.value = openDropdown.value === slug ? null : slug;
};

/* Scroller: Nur bei echtem Horizontal-Scroll Dropdown schließen */
const wrap = ref(null);
let lastLeft = 0;
const onHorizontalScroll = () => {
  const el = wrap.value; if (!el) return;
  const dx = Math.abs(el.scrollLeft - lastLeft);
  lastLeft = el.scrollLeft;
  if (dx > 8) openDropdown.value = null;
};

/* ---------------- Suche (?q=...) + Normalisierung ---------------- */
const qString = computed(() => Array.isArray(route.query.q) ? route.query.q[0] : (route.query.q ?? ''));
const normalize = (s) =>
  (s ?? '').toString().normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')
    .replace(/Ä/g,'Ae').replace(/Ö/g,'Oe').replace(/Ü/g,'Ue').replace(/ß/g,'ss')
    .toLowerCase().trim();
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
const selectedVenues    = computed(() => route.query.venues    ? route.query.venues.split(',').filter(Boolean)    : []);
const selectedPromoters = computed(() => route.query.promoters ? route.query.promoters.split(',').filter(Boolean) : []);
const selectedGenres    = computed(() => route.query.genres    ? route.query.genres.split(',').filter(Boolean)    : []);

/* ---------------- Basisitems (>= heute, optional ?date=) + Textsuche ---------------- */
const baseItems = computed(() => {
  const today = new Date(); today.setHours(0,0,0,0);
  const selectedDate = route.query.date;
  let list = (concertStore?.concerts ?? []).filter(it => new Date(it.date) >= today);
  if (selectedDate) list = list.filter(it => new Date(it.date).toISOString().split('T')[0] === selectedDate);
  return terms.value.length ? list.filter(matchesText) : list;
});

/* --------- Basis ohne Date (für Kalender-Markierungen) ------ */
const baseItemsNoDate = computed(() => {
  const today = new Date(); today.setHours(0,0,0,0);
  let list = (concertStore?.concerts ?? []).filter(it => new Date(it.date) >= today);
  return terms.value.length ? list.filter(matchesText) : list;
});

/* ---------------- Facetten anwenden ---------------- */
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

/* --------- Verfügbare ISO-Dates für den Datepicker -------- */
const calendarScoped = computed(() => applyFacets(baseItemsNoDate.value, { withVenues:true, withPromoters:true, withGenres:true }));
const availableDates = computed(() => {
  const set = new Set();
  for (const it of calendarScoped.value) {
    const iso = new Date(it.date).toISOString().split('T')[0];
    set.add(iso);
  }
  return Array.from(set);
});

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

  // Genres
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
      slug: name,
      selected: selectedGenres.value.includes(name),
      count,
    }))
    .filter(g => g.count > 0)
    .sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));
};

// initial + bei Änderungen neu berechnen
watch(
  () => [
    concertStore?.concerts,
    route.query.q,
    route.query.date,
    route.query.venues,
    route.query.promoters,
    route.query.genres,
  ],
  buildFilters,
  { immediate: true }
);

/* ---------------- Query-Pruning ---------------- */
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
  if (prunedVenues !== (route.query.venues ?? null))      { changed = true; if (prunedVenues) next.venues = prunedVenues; else delete next.venues; }
  if (prunedPromoters !== (route.query.promoters ?? null)){ changed = true; if (prunedPromoters) next.promoters = prunedPromoters; else delete next.promoters; }
  if (prunedGenres !== (route.query.genres ?? null))      { changed = true; if (prunedGenres) next.genres = prunedGenres; else delete next.genres; }

  if (changed) replaceQuery(next);
};
watch(() => [filters.venues, filters.promoters, filters.genres], pruneIfNeeded, { deep: true });

/* ---------------- Aktive Filter-Anzeige ---------------- */
const activeFilter = computed(
  () =>
    route.query.venues ||
    route.query.genres ||
    route.query.promoters ||
    route.query.date
);

/* ---- Helfer ---- */
const pad = (n) => String(n).padStart(2, '0');
const formatISODateDE = (iso) => {
  const [y,m,d] = (iso || '').split('-').map(Number);
  if (!y || !m || !d) return iso || '';
  return `${pad(d)}.${pad(m)}.${y}`;
};
const findNameBySlug = (list, slug) => list.find(i => i.slug === slug)?.name || slug;

/* ---- Aktive Chips bauen ---- */
const activeChips = computed(() => {
  const chips = [];

  if (route.query.date) {
    chips.push({
      key: `date:${route.query.date}`,
      category: 'date',
      slug: route.query.date,
      label: formatISODateDE(route.query.date),
    });
  }
  (selectedVenues.value || []).forEach(slug => {
    chips.push({ key: `venues:${slug}`, category: 'venues', slug, label: findNameBySlug(filters.venues, slug) });
  });
  (selectedPromoters.value || []).forEach(slug => {
    chips.push({ key: `promoters:${slug}`, category: 'promoters', slug, label: findNameBySlug(filters.promoters, slug) });
  });
  (selectedGenres.value || []).forEach(name => {
    chips.push({ key: `genres:${name}`, category: 'genres', slug: name, label: name });
  });

  return chips;
});

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

/* Chip entfernen -> bestehende Handler nutzen */
const removeChip = (chip) => {
  if (chip.category === 'date') {
    handleDateUpdate('');
  } else {
    handleSelectedItem(chip.category, { slug: chip.slug });
  }
};

/* Datum -> URL (yyyy-mm-dd) */
const handleDateUpdate = (isoDate) => {
  const query = { ...route.query };
  if (isoDate) query.date = isoDate;
  else delete query.date;
  router.push({ query });
};

const handleClearFilter = () => {
  concertStore?.resetShowUntilDaysFromNow?.();
  router.push({ query: {} });
};

/* ---------------- Click & Key outside ---------------- */
const handleClickOutside = (event) => {
  const t = event.target;
  if (t.closest('.dropdown') || t.closest('.dropdown-portal')) return;
  openDropdown.value = null;
};
const handleKeydown = (e) => {
  if (e.key === 'Escape' && openDropdown.value) {
    openDropdown.value = null;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* Einrückung für Filter (Pills brauchen sie nicht) */
.filters-unit{
  --filters-edge: .75rem;
}

/* ===== Filter-Row Wrapper scrollt ===== */
.filters-hs-wrap{
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
  width: 100%;
  padding-bottom: 2px;
  touch-action: pan-x;
}

/* ===== Inhalt als inline-grid ===== */
.filters-hs{
  --gutter: .5rem;
  --edge: var(--filters-edge);
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
  gap: var(--gutter);
  vertical-align: top;
}
.filters-hs::before,
.filters-hs::after{ content: ''; width: var(--edge); }
.filters-hs > li{
  list-style: none;
  scroll-snap-align: start;
}

/* Desktop: rechten Peek-Space weg -> Clear-Button kann bis Rand */
@media (min-width: 1024px){
  .filters-hs::after{ width: 0; }
}

/* === Aktive Pills (hinter Overlay; kein margin-left) === */
.active-pills{
  display: flex;
  flex-wrap: wrap;
  gap: .5rem .5rem;
  margin-top: 1.4rem;
  padding-left: 0;
  list-style: none;
  position: relative;
}
.active-pills > li{
  flex: 0 0 auto;
  will-change: transform;
}

.chip{
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  background: #e77000;
  color: #fff;
  border-radius: 9999px;
  padding: .375rem .75rem;
  font-size: .9rem;
  line-height: 1.1;
  white-space: nowrap;
}
@media (hover:hover){
  .chip:hover{ background: #c95f00; }
}
.chip-label{ display:inline-block; margin-left: 4px; }

.chip-close{
  appearance: none;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 9999px;
}
@media (hover:hover){
  .chip-close:hover{ background: rgba(0,0,0,.15); }
}
.chip-x{ width: 12px; height: 12px; }

/* === Transition-Group Animationen === */
.chip-fade-enter-active,
.chip-fade-leave-active{
  transition: opacity .2s ease, transform .2s ease;
}
.chip-fade-enter-from,
.chip-fade-leave-to{
  opacity: 0;
  transform: scale(.92);
}
.chip-fade-move{ transition: transform .22s ease; }
.chip-fade-leave-active{ position: absolute; }

/* === Z-Index Steuerung (nur wenn Dropdown offen) === */
.filters-elevated{
  position: relative;
  z-index: 240; /* über dem Overlay */
}

/* Clear-Button Look */
.cleartBtn {
  border: 0.5px solid;
  border-radius: 0.5rem;
  padding: 1rem 1.5rem;
  text-decoration: none;
  transition: background-color 0.3s ease, color 0.3s ease;
  color: #fff;
  cursor: pointer;
}
.cleartBtn:hover { background-color: #e0e0e0; color: #000; }
</style>

<!-- Overlay + Transition unscoped (Teleport nach <body>) -->
<style>
.phm-overlay{
  position: fixed;
  inset: 0;
  z-index: 220;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  background: rgba(19,19,19,.60);
}
.phm-overlay-fade-enter-active,
.phm-overlay-fade-leave-active { transition: opacity .18s ease; }
.phm-overlay-fade-enter-from,
.phm-overlay-fade-leave-to { opacity: 0; }
</style>
