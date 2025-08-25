<template>
  <DefaultGrid :no-spacing="true" class="gap-x-4 xl:gap-x-6">
    <!-- Zentriert: 10 Spalten (2–12) -->
    <div class="xl:col-start-2 xl:col-end-12">
      <TransitionGroup name="list" tag="div">
        <div
          v-for="(group, date) of visibleGroupedItems"
          :key="`${date}-${group[0]?.id || ''}`"
          :class="!hideDateHeaders ? 'mb-2' : 'mb-2'"
        >
          <!-- Datumstitel (sticky) -->
          <p
            v-if="!hideDateHeaders"
            class="md:text-2xl font-semibold mb-2 sticky z-[100] pt-4 pb-2 fs-mobile-13"
            :style="stickyStyle"
          >
            <template v-if="weekDay(group[0].date) === 'Heute'">
              <span class="underline text-[#E77000]">Heute,</span>
              <span class="no-underline text-current" aria-hidden="true">&nbsp;</span>
              <span>{{ date }}</span>
            </template>
            <template v-else>
              <span class="text-current">{{ weekDay(group[0].date) }},</span>
              <span class="no-underline text-current" aria-hidden="true">&nbsp;</span>
              <span>{{ date }}</span>
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
import { computed } from 'vue'
import { format } from 'date-fns'
import { useRoute } from 'vue-router'

const route = useRoute()

const { items, hideDateHeaders = false } = defineProps({
  items: { type: Array, required: true, default: () => [] },
  hideDateHeaders: { type: Boolean, default: false },
})

/* Sticky-Top: bewusst KEIN Navbar-Offset mehr.
   So rutscht der Datumstitel beim Hochscrollen HINTER die Navbar.
   Safe-Area bleibt berücksichtigt. */
const stickyStyle = computed(() => ({
  top: 'env(safe-area-inset-top, 0px)',
  display: 'flex',
  alignItems: 'center',
  WebkitBackdropFilter: 'blur(30px)',
  backdropFilter: 'blur(30px)',
  backgroundColor: 'rgba(19, 19, 19, 0.6)',
  width: '100%',
  willChange: 'opacity, transform',
  transform: 'translateZ(0)',
}))

// Abkürzungen ohne Punkt: So, Mo, Di, Mi, Do, Fr, Sa (Heute bleibt speziell)
function weekDay(dateStr) {
  const date = new Date(dateStr)
  const today = new Date()
  const sameDay =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()

  if (sameDay) return 'Heute'

  const abbr = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'] // 0 = Sonntag
  return abbr[date.getDay()]
}

function formattedDate(dateStr) {
  return format(new Date(dateStr), 'dd.MM.yyyy')
}

// --- Suche (aus URL ?q=...) ---
const qString = computed(() => {
  const q = route.query.q
  return Array.isArray(q) ? q[0] : (q ?? '')
})

const normalize = (s) =>
  (s ?? '')
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue')
    .replace(/Ä/g, 'Ae').replace(/Ö/g, 'Oe').replace(/Ü/g, 'Ue')
    .replace(/ß/g, 'ss')
    .toLowerCase()
    .trim()

const terms = computed(() => normalize(qString.value).split(/\s+/).filter(Boolean))
const isSearching = computed(() => terms.value.length > 0)

const matches = (item) => {
  if (!isSearching.value) return true
  const hay = normalize([
    item?.name,
    item?.subtitle,
    Array.isArray(item?.artist) ? item.artist.map(a => a?.name).join(' ') : item?.artist?.name,
    item?.venue?.name,
    Array.isArray(item?.genres) ? item.genres.map(g => g?.name).join(' ') : item?.genres,
    item?.promoter?.name,
    item?.slug
  ].filter(Boolean).join(' '))
  return terms.value.every(t => hay.includes(t))
}

// Gruppieren nach Datum
const groupedItems = computed(() =>
  items.reduce((groups, item) => {
    const dateKey = formattedDate(item.date)
    ;(groups[dateKey] ||= []).push(item)
    return groups
  }, {})
)

// Sichtbare Gruppen
const visibleGroupedItems = computed(() => {
  const result = {}
  for (const [date, group] of Object.entries(groupedItems.value)) {
    if (!isSearching.value) {
      result[date] = group
      continue
    }
    const matched = group.filter(matches)
    if (matched.length) {
      result[date] = matched
    }
  }
  return result
})
</script>

<style scoped>
/* Mobile: < 640px -> 1.3rem */
@media (max-width: 768px) {
  .fs-mobile-13 { font-size: 1.3rem; }
}

/* Animations */
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
