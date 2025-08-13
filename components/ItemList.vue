<template>
  <DefaultGrid :no-spacing="true" class="gap-x-4 xl:gap-x-6">
    <!-- Zentriert: 10 Spalten (2–12) -->
    <div class="xl:col-start-2 xl:col-end-12">
      <TransitionGroup name="list" tag="div">
        <div
          v-for="(group, date) of visibleGroupedItems"
          :key="`${date}-${group[0]?.id || ''}`"
          :class="!hideDateHeaders ? 'mb-16' : 'mb-5'"
        >
          <!-- Datumstitel: bleibt sichtbar, sobald die Gruppe Treffer hat -->
          <p v-if="!hideDateHeaders" class="text-2xl font-semibold mb-6">
            <template v-if="weekDay(group[0].date) === 'Heute'">
              <span class="underline">Heute</span>, {{ date }}
            </template>
            <template v-else>
              {{ weekDay(group[0].date) }}, {{ date }}
            </template>
          </p>

          <!-- Konzert-Items -->
          <div v-for="item in group" :key="item.id" class="w-full">
            <ItemsConcert :item="item" class="w-full block max-w-none" />
          </div>
        </div>
      </TransitionGroup>
    </div>
  </DefaultGrid>
</template>

<script setup>
import { computed } from 'vue';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { useRoute } from 'vue-router';

const route = useRoute();

const { items, hideDateHeaders = false } = defineProps({
  items: { type: Array, required: true, default: () => [] },
  hideDateHeaders: { type: Boolean, default: false },
});

function weekDay(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();
  const sameDay =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
  return sameDay ? 'Heute' : format(date, 'EEEE', { locale: de });
}

function formattedDate(dateStr) {
  return format(new Date(dateStr), 'dd.MM.yyyy');
}

// --- Suche (aus URL ?q=...) ---
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
const isSearching = computed(() => terms.value.length > 0);

const matches = (item) => {
  if (!isSearching.value) return true;
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

// Gruppieren nach Datum
const groupedItems = computed(() =>
  items.reduce((groups, item) => {
    const dateKey = formattedDate(item.date);
    (groups[dateKey] ||= []).push(item);
    return groups;
  }, {})
);

// Sichtbare Gruppen:
// - ohne Suche: alle Items unverändert
// - mit Suche: je Datum nur die gematchten Items; leere Tage werden weggelassen
const visibleGroupedItems = computed(() => {
  const result = {};
  for (const [date, group] of Object.entries(groupedItems.value)) {
    if (!isSearching.value) {
      result[date] = group;
      continue;
    }
    const matched = group.filter(matches);
    if (matched.length) {
      result[date] = matched;
    }
  }
  return result;
});
</script>

<style>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-active {
  position: absolute;
  width: 100%;
}
.list-move {
  transition: transform 0.5s ease;
}
</style>
