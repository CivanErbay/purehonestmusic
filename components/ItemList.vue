<template>
  <DefaultGrid :no-spacing="true">
    <div class="xl:col-start-3 xl:col-end-11">
      <TransitionGroup name="list" tag="div">
        <div

          v-for="(group, date) of visibleGroupedItems"
          :key="date"
          class="mb-16"
        >
          <p class="text-2xl font-semibold mb-6">
            <span :class="{ underline: weekDay(group[0].date) === 'Heute' }"
              >{{ weekDay(group[0].date) }},</span
            >
            {{ date }}
          </p>
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
const { items } = defineProps({
  items: {
    type: Array,
    required: true,
    default: () => [],
  },
});

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

const visibleGroupedItems = computed(() => {
  const groupedDates = Object.keys(groupedItems.value);
  return groupedDates.reduce((result, date) => {
    result[date] = groupedItems.value[date];
    return result;
  }, {});
});
</script>

<style>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
