<template>
  <div class="dropdown text-lg font-thin">
    <button
      class="px-6 py-4 bg-bg-2 rounded-lg align-middle"
      @click="toggleDropdown"
    >
      {{ title }}
      <svg
        :class="{ 'rotate-180': isOpen, 'rotate-0': !isOpen }"
        class="inline-block w-4 h-4 ml-2 transition-transform duration-200"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
    <transition name="dropdown">
      <div
        v-if="isOpen"
        class="dropdown-menu max-h-[230px] w-max overflow-y-auto bg-bg-2 p-4 rounded-lg"
      >
        <div v-for="(item, index) in items" :key="index" class="dropdown-item">
          <input
            type="checkbox"
            :id="'item-' + index"
            v-model="selectedItems"
            :value="item.name"
            class="mr-4"
          />
          <label :for="'item-' + index">{{ item.name }}</label>
          <span class="item-count">{{ item.count }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  title: String,
  items: Array,
});

const emit = defineEmits(['update:selectedItems']);

const isOpen = ref(false);
const selectedItems = ref([]);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

watch(selectedItems, (newVal) => {
  emit('update:selectedItems', newVal);
});
</script>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  position: absolute;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
}

.item-count {
  margin-left: auto;
  padding-left: 8px;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}
</style>
