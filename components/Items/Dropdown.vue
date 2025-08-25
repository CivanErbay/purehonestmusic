<template>
  <div class="dropdown relative text-lg font-thin" ref="triggerRef">
    <!-- Trigger -->
    <button
      class="p-4 sm:px-6 sm:py-4 bg-bg-light rounded-lg align-middle border inline-flex items-center font-medium dropdown-hover"
      :class="{ 'border-primary': open, 'border-bg-light': !open }"
      @click="onOpenClick"
      type="button"
      v-bind="$attrs"
    >
      <span class="pt-1">{{ title }}</span>
      <svg
        :class="{ 'rotate-180': open, 'rotate-0': !open }"
        class="mobile-chevron inline-block w-4 h-4 sm:ml-2 transition-transform duration-200"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- TELEPORT: Overlay + Menü -->
    <teleport to="body">
      <!-- Blur-Overlay (liegt über Seite, unter Menü) -->
      <transition name="overlay-fade">
        <div
          v-if="open"
          class="phm-blur-overlay"
          @click="closeViaOverlay"
          aria-hidden="true"
        />
      </transition>

      <!-- Menü-Portal -->
      <div v-if="open" class="dropdown dropdown-portal">
        <div
          ref="menuRef"
          class="dropdown-menu"
          :style="menuStyle"
        >
          <!-- Liste -->
          <div class="dropdown-scroll">
            <div v-for="item in items" :key="item.slug || item.name">
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

          <!-- Footer: Bestätigen -->
          <div class="menu-footer">
            <button type="button" class="btn-confirm" @click="confirmAndClose">
              Bestätigen
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  title: String,
  slug: String,
  open: Boolean,
  items: Array,
});
const emit = defineEmits(['update:selectedItems', 'update:toggle']);

const triggerRef = ref(null);
const menuRef = ref(null);

const menuStyle = reactive({
  position: 'fixed',
  top: '0px',
  left: '0px',
  width: '342px',
  minWidth: '180px',
  // Höhe/Scrollbereiche -> via CSS gesteuert; hier nur Fallback
  zIndex: 1
});

const toggleItem = (item) => emit('update:selectedItems', props.slug, item);
const toggleDropdown = () => emit('update:toggle', props.slug);
const onOpenClick = () => {
  toggleDropdown();
  // Smooth scroll zu den Filtern, wenn man noch weit oben ist
  const wrap = document.querySelector('.filters-hs-wrap');
  if (wrap && window.scrollY < wrap.getBoundingClientRect().top + window.scrollY - 20) {
    const offset = (getComputedStyle(document.documentElement).getPropertyValue('--phm-navbar-h') || '64').replace('px', '');
    const target = wrap.getBoundingClientRect().top + window.scrollY - (parseInt(offset, 10) || 64) - 8;
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
};

const closeViaOverlay = () => {
  // Overlay-Klick schließt Menü
  emit('update:toggle', null);
};
const confirmAndClose = () => {
  emit('update:toggle', null);
};

const getContainerRect = (el) => {
  const container = el.closest('.mx-auto') || document.documentElement;
  return container.getBoundingClientRect();
};

const positionMenu = () => {
  const trigger = triggerRef.value;
  const menu = menuRef.value;
  if (!trigger || !menu) return;

  const rect = trigger.getBoundingClientRect();
  const containerRect = getContainerRect(trigger);
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const gap = 6;
  const isMobile = vw < 640;

  const top = rect.bottom + gap; // immer UNTER dem Trigger

  if (isMobile) {
    menuStyle.left = `${containerRect.left}px`;
    menuStyle.width = `${containerRect.width}px`;
    menuStyle.minWidth = `${containerRect.width}px`;
  } else {
    const desired = Math.max(rect.width, 342);
    let left = rect.left;
    const maxLeft = vw - 8 - desired;
    if (left < 8) left = 8;
    if (left > maxLeft) left = maxLeft;
    menuStyle.left = `${left}px`;
    menuStyle.width = `${desired}px`;
    menuStyle.minWidth = `${desired}px`;
  }

  // Höhe: Desktop automatisch, Mobile per CSS 465px
  menuStyle.top = `${top}px`;
};

const addListeners = () => {
  window.addEventListener('resize', positionMenu, { passive: true });
  window.addEventListener('scroll', positionMenu, { passive: true, capture: true });
};
const removeListeners = () => {
  window.removeEventListener('resize', positionMenu);
  window.removeEventListener('scroll', positionMenu, { capture: true });
};

watch(() => props.open, async (isOpen) => {
  if (isOpen) { await nextTick(); positionMenu(); addListeners(); }
  else { removeListeners(); }
});

onMounted(() => { if (props.open) { nextTick(positionMenu); addListeners(); } });
onBeforeUnmount(removeListeners);
</script>

<style scoped>
/* ---------- Overlay ---------- */
.phm-blur-overlay{
  position: fixed;
  inset: 0;
  z-index: 170; /* über Seiten-Content & Reset-Button, unter Menü */
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  background-color: rgba(19,19,19,0.60);
}
.overlay-fade-enter-active,
.overlay-fade-leave-active{ transition: opacity .18s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to{ opacity: 0; }

/* ---------- Portal / Menü ---------- */
.dropdown { display: inline-block; }

.dropdown-portal {
  position: fixed; inset: 0;
  pointer-events: none;
  display: block;
  z-index: 230; /* über Overlay */
}
.dropdown-portal > .dropdown-menu { pointer-events: auto; }

.dropdown-menu{
  position: fixed;
  background: #1f1f1f;
  border-radius: 12px;
  border: 1px solid #1f1f1f;
  box-shadow: 0 18px 40px rgba(0,0,0,0.35);
  overflow: hidden; /* damit Footer-Radius greift */
}

/* Scrollbereich + Footer-Höhenlogik */
.dropdown-scroll{
  overflow-y: auto;
  max-height: calc(var(--phm-dropdown-height, 520px) - 68px); /* 68px Footer */
  padding: 16px;
}
.menu-footer{
  position: sticky;
  bottom: 0;
  padding: 12px 16px 14px;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  background: rgba(31,31,31,0.92);
  border-top: none;
  display: flex;
  justify-content: center;
}
.btn-confirm{
  border-radius: .25rem;
  background-color: #E77000;
  padding: .6rem 2rem;
  color: #fff;
  font-weight: 600;
  transition: filter .15s ease;
}
.btn-confirm:hover{ filter: brightness(1.1); }

/* Mobile: feste Höhe 465px */
@media (max-width: 639px){
  .dropdown-menu{ --phm-dropdown-height: 465px; width: 100% !important; min-width: 100% !important; left: 0 !important; }
  .mobile-chevron { margin-left: 10px; margin-top: 3px; }
}

/* Items */
.dropdown-item{ display:flex; justify-content:space-between; padding:8px; background:transparent; transition:background-color .3s,color .3s; cursor:pointer; border-radius:8px;}
.dropdown-item:hover{ background:#242424; }
.item-count{ margin-left:auto; padding-left:24px; right:5px; position:relative; }

/* Trigger Hover */
.dropdown-hover{ border-radius:.5rem; transition:background-color .3s ease,color .3s ease; background:transparent; }
.dropdown-hover:hover{ border-radius:.5rem; background:#242424; color:#fff; }

.pt-1{ padding-top:1px; }

/* Checkbox */
.custom-checkbox{ width:16px; height:16px; appearance:none; background:#fff; border:none; outline:none; cursor:pointer; position:relative; margin-right:14px; }
.custom-checkbox:checked{ background:#e77000; }
.custom-checkbox:checked::after{ content:''; position:absolute; top:46%; left:50%; width:6px; height:10px; border:solid #fff; border-width:0 2px 2px 0; transform:translate(-50%,-50%) rotate(45deg); }

.position{ display:inline; position:relative; top:.06rem; }
.positionHover{ top:6px; position:relative; left:4px; }
</style>
