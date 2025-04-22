<template>
  <DefaultGrid :no-spacing="true">
    <div class="xl:col-start-3 xl:col-end-11">
      <TransitionGroup name="list" tag="div">
        <div
          v-for="(group, date) of visibleGroupedItems"
          :key="`${date}-${group[0]?.id || ''}`"
          :class="hideDateHeaders ? 'mb-5' : 'mb-16'"
        >
          <!-- Datumstitel nur anzeigen, wenn nicht ausgeblendet -->
          <p v-if="!hideDateHeaders" class="text-2xl font-semibold mb-6">
            <template v-if="weekDay(group[0].date) === 'Heute'">
              <span class="underline">Heute</span>, {{ date }}
            </template>
            <template v-else>
              {{ weekDay(group[0].date) }}, {{ date }}
            </template>
          </p>

          <!-- Konzert-Items -->
          <ItemsConcert
            v-for="item in group"
            :key="item.id"
            class="xl:col-start-3 xl:col-end-11"
            :item="item"
          />
        </div>
      </TransitionGroup>
    </div>
  </DefaultGrid>
</template>

<script setup>
import { computed } from 'vue';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const { items, hideDateHeaders = false } = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
  hideDateHeaders: {
    type: Boolean,
    default: false,
  },
});

// Gibt "Heute" oder den Wochentag zurück
function weekDay(dateStr) {
  const date = new Date(dateStr);
  const today = new Date();

  // Datum ohne Uhrzeit vergleichen
  const sameDay =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return sameDay ? 'Heute' : format(date, 'EEEE', { locale: de });
}

// Formatiert Datum als "13.03.2025"
function formattedDate(dateStr) {
  return format(new Date(dateStr), 'dd.MM.yyyy');
}

// Gruppierung nach Datum
const groupedItems = computed(() => {
  return items.reduce((groups, item) => {
    const dateKey = formattedDate(item.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(item);
    return groups;
  }, {});
});

// Sichtbare Gruppen zurückgeben (z. B. alle)
const visibleGroupedItems = computed(() => {
  const groupedDates = Object.keys(groupedItems.value);
  return groupedDates.reduce((result, date) => {
    result[date] = groupedItems.value[date];
    return result;
  }, {});
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
