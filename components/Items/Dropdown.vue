<template>
  <div class="dropdown text-lg font-thin">
    <button
      class="px-6 py-4 bg-bg-2 rounded-lg align-middle"
      @click="toggleDropdown"
    >
      {{ title }}
      <svg
        :class="{ 'rotate-180': open, 'rotate-0': !open }"
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
        v-if="open"
        class="dropdown-menu max-h-[230px] w-max overflow-y-auto bg-bg-2 p-4 rounded-lg"
      >
        <div v-for="(item, index) in items" :key="index" class="dropdown-item">
          <label>
            <input
              type="checkbox"
              :value="item"
              @change="toggleItem(item)"
              :checked="item.selected"
            />
            {{ item.name }}
          </label>
          <span class="item-count text-slate-400">{{ item.count }}</span>
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

const emit = defineEmits(['update:selectedItems']);

const toggleItem = (item) => {
  emit('update:selectedItems', props.slug, item);
};

const toggleDropdown = () => {
  emit('update:toggle', props.slug);
};
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
  padding-left: 12px;
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
