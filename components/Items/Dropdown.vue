<template>
  <div class="dropdown sm:relative text-lg font-thin">
    <button
      class="p-4 sm:px-6 sm:py-4 bg-bg-light rounded-lg align-middle border inline-flex items-center"
      :class="{ ' border-primary': open, 'border-bg-light': !open }"
      @click="toggleDropdown"
    >
      <span class="opacity-70"> {{ title }}</span>
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
        class="dropdown-menu max-h-[360px] left-0 max-w-screen sm:w-max overflow-y-auto bg-bg-light p-4 rounded-lg"
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
  z-index: 1;
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  padding: 8px;
}

.item-count {
  margin-left: auto;
  padding-left: 24px;
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
