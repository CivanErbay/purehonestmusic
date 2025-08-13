<template>
  <div class="dropdown sm:relative text-lg font-thin">
    <button
      class="p-4 sm:px-6 sm:py-4 bg-bg-light rounded-lg align-middle border inline-flex items-center font-medium dropdown-hover"
      :class="{ ' border-primary': open, 'border-bg-light': !open }"
      @click="toggleDropdown"
    >
      <span class="pt-1"> {{ title }}</span>
      <svg
        :class="{ 'rotate-180': open, 'rotate-0': !open }"
        class="inline-block w-4 h-4 sm:ml-2 transition-transform duration-200"
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
        v-if="open"
        class="dropdown-menu max-h-[380px] left-0 max-w-screen sm:w-max overflow-y-auto bg-bg-light p-4 rounded-lg"
      >
        <div v-for="item in items" :key="item.name">
          <label class="dropdown-item dynamicFontSize">
            <input
              type="checkbox"
              class="custom-checkbox positionHover"
              :value="item"
              @change="toggleItem(item)"
              :checked="item.selected"
            />
            <div class="position">{{ item.name }}</div>
            <span class="item-count text-slate-200">{{ item.count }}</span>
          </label>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
  slug: String,
  open: Boolean,
  items: Array,
});

const emit = defineEmits(['update:selectedItems', 'update:toggle']);

const toggleItem = (item) => {
  emit('update:selectedItems', props.slug, item);
};

const toggleDropdown = () => {
  emit('update:toggle', props.slug);
};
</script>

<style scoped>
.dropdown {
  display: inline-block;
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: calc(100% + 4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 10;
  width: 342px;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
}

.item-count {
  margin-left: auto;
  padding-left: 24px;
  right: 5px;
  position: relative;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
}

.dropdown-hover {
  border-radius: 0.5rem;
  transition: background-color 0.3s ease, color 0.3s ease;
  background-color: transparent;
}

.dropdown-hover:hover {
  border-radius: 0.5rem;
  background-color: #242424;
  color: #fff;
}

.pt-1 {
  padding-top: 1px;
}

.custom-checkbox {
  width: 16px;
  height: 16px;
  appearance: none; /* Entfernt Standard-Styling */
  background-color: white;
  border: none;
  outline: none;
  cursor: pointer;
  position: relative; /* Für das Pseudoelement erforderlich */
  margin-right: 14px;
}

.custom-checkbox:checked {
  background-color: #e77000; /* Orange Fläche bei Auswahl */
}

.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  top: 46%;
  left: 50%;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: translate(-50%, -50%) rotate(45deg);
}

.position {
  display: inline;
  position: relative;
  top: 0.06rem;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
  background-color: transparent; /* Standard-Hintergrund */
  transition: background-color 0.3s ease, color 0.3s ease; /* Smooth Transition */
  cursor: pointer; /* Zeigt Interaktivität an */
}

.dropdown-item:hover {
  background-color: #242424; /* Leichtes Grau bei Hover */
  border-radius: 8px;
}

.positionHover {
  top: 6px;
  position: relative;
  left: 4px;
}
</style>
