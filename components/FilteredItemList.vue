<template>
  <div class="">
    <ItemList :items="filteredItems" />

    <!-- Button mit fixierter Breite & zentrierten, größeren hüpfenden Punkten -->
    <div
      v-if="beforeDateFilteredConcerts.length > filteredItems.length"
      class="flex justify-center"
    >
      <button
        @click="handleShowMore"
        class="btn relative flex items-center justify-center gap-2 px-6 py-2 min-h-[42px] w-[300px]"
        :class="{
          'opacity-50 pointer-events-none': isLoading || filteredItems.length >= concertStore.totalConcerts,
        }"
      >
        <!-- Dots centered via flex and absolute positioning -->
        <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
          <div class="dots-loader"><div></div></div>
        </div>
        <span v-else>Mehr Konzerte anzeigen</span>
      </button>
    </div>

    <div class="flex justify-center mt-2 text-gray-400 mb-16">
      <p class="text-sm">
        {{ filteredItems.length }} von
        {{ beforeDateFilteredConcerts.length }} Konzerten
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

const handleShowMore = async () => {
  if (isLoading.value) return;

  isLoading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600)); // künstlicher Delay
  concertStore.showMoreConcerts();
  isLoading.value = false;
};

const beforeDateFilteredConcerts = computed(() => {
  const selectedVenues = route.query.venues
    ? route.query.venues.split(',')
    : [];
  const selectedPromoters = route.query.promoters
    ? route.query.promoters.split(',')
    : [];
  const selectedGenres = route.query.genres
    ? route.query.genres.split(',')
    : [];

  return concertStore.concerts.filter((item) => {
    const venueMatch =
      selectedVenues.length === 0 || selectedVenues.includes(item.venue?.slug);
    const promoterMatch =
      selectedPromoters.length === 0 ||
      selectedPromoters.includes(item.promoter?.slug);
    const genreMatch =
      selectedGenres.length === 0 ||
      selectedGenres.some((genre) =>
        item.genres.map((g) => g.name).includes(genre)
      );
    return venueMatch && promoterMatch && genreMatch;
  });
});

const filteredItems = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = route.query.date;

  let items = beforeDateFilteredConcerts.value.filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= today;
  });

  if (selectedDate) {
    return items.filter((item) => {
      const itemDate = new Date(item.date);
      const newItemDate = new Date(itemDate).toISOString().split('T')[0];
      return newItemDate === selectedDate;
    });
  }

  if (items.length < 7) {
    return items;
  }

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + concertStore.showUntilDaysFromNow);
  maxDate.setHours(0, 0, 0, 0);

  let count = 0;
  return items.filter((item) => {
    const itemDate = new Date(item.date);
    count++;
    return itemDate <= maxDate || count <= 7;
  });
});

// auto load fallback
watch(
  [() => concertStore.showUntilDaysFromNow, () => filteredItems.value.length],
  async (newVal, oldVal) => {
    if (
      newVal[0] >= oldVal[0] &&
      newVal[1] === oldVal[1] &&
      beforeDateFilteredConcerts.value.length !== newVal[1]
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
  animation: bounce 0.22s infinite alternate; /* ⬅️ schneller gemacht */
}

.dots-loader::after {
  animation-delay: 0.15s; /* leicht angepasst */
}
.dots-loader div {
  animation-delay: 0.21s;  /* leicht angepasst */
}

@keyframes bounce {
  0% {
    transform: translateY(0);
    opacity: 0.6;
  }
  100% {
    transform: translateY(-6px);
    opacity: 1;
  }
}
</style>
