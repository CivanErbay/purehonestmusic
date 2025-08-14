<template>
  <div class="">
    <ItemList :items="filteredItems" />

    <!-- Button: zeigen, wenn es MEHR Treffer gibt als aktuell angezeigt -->
    <div
      v-if="fullAvailableItems.length > filteredItems.length"
      class="flex justify-center"
    >
      <button
        @click="handleShowMore"
        class="btn relative flex items-center justify-center gap-2 px-6 py-5 mt-10 min-h-[64px] w-[280px]"
        :class="{
          'opacity-50 pointer-events-none': isLoading || (filteredItems.length >= fullAvailableItems.length),
        }"
      >
        <div v-if="isLoading" class="absolute inset-0 flex items-center py-5 justify-center">
          <div class="dots-loader"><div></div></div>
        </div>
        <span v-else class="!font-black">Mehr Konzerte anzeigen</span>
      </button>
          </div>

    <!-- Counter: immer zeigen – „gezeigt von gesamt gefiltert“ -->
    <div class="flex justify-center mt-2 text-gray-400 mb-12">
      <p class="text-sm">
        {{ filteredItems.length }} von
        {{ fullAvailableItems.length }} Konzerten
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const isLoading = ref(false);
const concertStore = useConcertStore();
const route = useRoute();

/* ---------------- Suche ---------------- */
const qString = computed(() => {
  const q = route.query.q;
  return Array.isArray(q) ? q[0] : (q ?? '');
});
const normalize = (s) =>
  (s ?? '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue')
    .replace(/Ä/g,'Ae').replace(/Ö/g,'Oe').replace(/Ü/g,'Ue')
    .replace(/ß/g,'ss')
    .toLowerCase()
    .trim();
const terms = computed(() => normalize(qString.value).split(/\s+/).filter(Boolean));
const isSearching = computed(() => terms.value.length > 0);

const matchesText = (item) => {
  if (!terms.value.length) return true;
  const hay = normalize([
    item?.name,
    item?.subtitle,
    Array.isArray(item?.artist) ? item.artist.map(a => a?.name).join(' ') : item?.artist?.name,
    item?.venue?.name,
    Array.isArray(item?.genres) ? item.genres.map(g => g?.name).join(' ') : item?.genres,
    item?.promoter?.name,   // <- „Popanz“ matcht hier
    item?.slug
  ].filter(Boolean).join(' '));
  return terms.value.every(t => hay.includes(t));
};

/* -------------- Facetten (venue/promoter/genres) -------------- */
const facetFiltered = computed(() => {
  const selectedVenues = route.query.venues ? route.query.venues.split(',') : [];
  const selectedPromoters = route.query.promoters ? route.query.promoters.split(',') : [];
  const selectedGenres = route.query.genres ? route.query.genres.split(',') : [];

  return concertStore.concerts.filter((item) => {
    const venueMatch = selectedVenues.length === 0 || selectedVenues.includes(item.venue?.slug);
    const promoterMatch = selectedPromoters.length === 0 || selectedPromoters.includes(item.promoter?.slug);
    const genreMatch =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) => item.genres.map((g) => g.name).includes(genre));
    return venueMatch && promoterMatch && genreMatch;
  });
});

/* -------------- Textsuche anwenden -------------- */
const searchFiltered = computed(() => {
  const list = facetFiltered.value;
  return terms.value.length ? list.filter(matchesText) : list;
});

/* -------------- Datumsfilter (>= heute und optional ?date=) -------------- */
const fullAvailableItems = computed(() => {
  const today = new Date(); today.setHours(0,0,0,0);
  const selectedDate = route.query.date;

  let items = searchFiltered.value.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= today;
  });

  if (selectedDate) {
    items = items.filter((item) => {
      const itemDate = new Date(item.date);
      const iso = new Date(itemDate).toISOString().split('T')[0];
      return iso === selectedDate;
    });
  }

  // sortiert nach Datum aufsteigend (wichtig für Pagination)
  return items.slice().sort((a,b) => new Date(a.date) - new Date(b.date));
});

/* -------------- Sichtbare Items -------------- */
const SEARCH_PAGE_INIT = 7;
const SEARCH_PAGE_STEP = 10;
const searchPageSize = ref(SEARCH_PAGE_INIT);

// Reset der Page-Größe, wenn sich die Suche ändert
watch(() => qString.value, () => {
  searchPageSize.value = SEARCH_PAGE_INIT;
});

// Branching: bei Suche paginieren; sonst altes „bis Datum X“-Fenster nutzen
const filteredItems = computed(() => {
  const items = fullAvailableItems.value;

  if (isSearching.value) {
    return items.slice(0, searchPageSize.value);
  }

  // --- Original-Verhalten ohne Suche ---
  if (items.length < 7) return items;

  const today = new Date(); today.setHours(0,0,0,0);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + concertStore.showUntilDaysFromNow);
  maxDate.setHours(0,0,0,0);

  let count = 0;
  return items.filter((item) => {
    const itemDate = new Date(item.date);
    count++;
    return itemDate <= maxDate || count <= 7;
  });
});

/* -------------- Load More -------------- */
const handleShowMore = async () => {
  if (isLoading.value) return;
  isLoading.value = true;

  await new Promise((r) => setTimeout(r, 300)); // kurzer Loader für UX

  if (isSearching.value) {
    searchPageSize.value += SEARCH_PAGE_STEP; // lokale Pagination in der Suche
  } else {
    concertStore.showMoreConcerts(); // Store-Mechanik wie gehabt
  }

  isLoading.value = false;
};

/* -------------- Auto-Load: weiterhin nicht bei Suche -------------- */
watch(
  [() => concertStore.showUntilDaysFromNow, () => filteredItems.value.length, () => isSearching.value],
  async (newVal, oldVal) => {
    if (newVal[2]) return; // Suche aktiv → nicht auto-nachladen
    if (
      newVal[0] >= oldVal[0] &&
      newVal[1] === oldVal[1] &&
      fullAvailableItems.value.length !== newVal[1]
    ) {
      concertStore.showMoreConcerts();
    }
  }
);
</script>

<style scoped>
.dots-loader {
  display: flex;
  gap: 6px;
  height: 1rem;
}
.dots-loader::before,
.dots-loader::after,
.dots-loader div {
  content: '';
  width: 10px;
  height: 10px;
  background: #d1d1d1;
  border-radius: 50%;
  animation: bounce 0.22s infinite alternate;
}
.dots-loader::after { animation-delay: 0.15s; }
.dots-loader div { animation-delay: 0.21s; }

@keyframes bounce {
  0% { transform: translateY(0); opacity: 0.6; }
  100% { transform: translateY(-6px); opacity: 1; }
}
</style>
