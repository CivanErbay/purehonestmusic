<template>
  <div class="dropdown relative text-lg font-thin" ref="triggerRef">
    <!-- Trigger -->
    <button
      class="phm-filter-btn bg-bg-light rounded-lg align-middle border inline-flex items-center font-medium dropdown-hover"
      :class="{ 'border-primary': open, 'border-bg-light': !open }"
      @click="onOpenClick"
      type="button"
      :id="triggerId"
      :aria-expanded="open ? 'true' : 'false'"
      aria-haspopup="dialog"
      :aria-controls="menuId"
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

    <!-- Teleport: nur das Menü -->
    <teleport to="body">
      <div v-if="open" class="dropdown dropdown-portal">
        <div
          ref="menuRef"
          class="dropdown-menu rounded-lg border border-[#1f1f1f] p-0"
          :style="menuStyle"
          :id="menuId"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="triggerId"
          tabindex="-1"
        >
          <!-- Inhalt -->
          <div class="menu-content">
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

          <!-- Footer: fixer Bestätigen-Button -->
          <div class="menu-footer">
            <button type="button" class="btn w-full" @click="confirmAndClose(true)" aria-label="Auswahl bestätigen und schließen">
              Bestätigen
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue';

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
  maxHeight: '400px',
  overflow: 'hidden',            // Inhalt scrollt in .menu-content
  zIndex: 1,
  backgroundColor: '#1f1f1f',
});

const triggerId = computed(() => `filter-${props.slug}-btn`);
const menuId    = computed(() => `filter-${props.slug}-menu`);

const toggleItem = (item) => emit('update:selectedItems', props.slug, item);

const onOpenClick = () => {
  emit('update:toggle', props.slug);
  requestAnimationFrame(() => {
    positionMenu();
    try {
      if (window.scrollY < 120 && triggerRef.value) {
        const r = triggerRef.value.getBoundingClientRect();
        const y = r.top + window.scrollY - 88; // unter Navbar
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } catch {}
  });
};

const confirmAndClose = () => emit('update:toggle', props.slug);

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

  const top = rect.bottom + gap;

  if (isMobile) {
    menuStyle.left = `${containerRect.left}px`;
    menuStyle.width = `${containerRect.width}px`;
    menuStyle.minWidth = `${containerRect.width}px`;
    menuStyle.maxHeight = '465px'; // Mobile-Vorgabe
  } else {
    const desired = Math.max(rect.width, 342);
    let left = rect.left;
    const maxLeft = vw - 8 - desired;
    if (left < 8) left = 8;
    if (left > maxLeft) left = maxLeft;
    menuStyle.left = `${left}px`;
    menuStyle.width = `${desired}px`;
    menuStyle.minWidth = `${desired}px`;
    const spaceBelow = vh - top - 8;
    const clamped = Math.max(200, Math.min(520, spaceBelow));
    menuStyle.maxHeight = `${clamped}px`;
  }

  menuStyle.top = `${top}px`;
};

/* ---------- A11y: Focus-Management & ESC + Focus-Trap ---------- */
let prevFocused = null;
const focusableSelector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const trapKeydown = (e) => {
  if (!menuRef.value) return;
  if (e.key === 'Escape') {
    e.stopPropagation();
    confirmAndClose();
    return;
  }
  if (e.key !== 'Tab') return;

  const nodes = Array.from(menuRef.value.querySelectorAll(focusableSelector));
  if (nodes.length === 0) return;

  const first = nodes[0];
  const last  = nodes[nodes.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
};

const startFocusManagement = () => {
  prevFocused = document.activeElement;
  // Fokus ins Menü setzen
  const nodes = menuRef.value?.querySelectorAll(focusableSelector);
  if (nodes && nodes.length) {
    nodes[0].focus();
  } else {
    menuRef.value?.focus();
  }
  menuRef.value?.addEventListener('keydown', trapKeydown, true);
};

const stopFocusManagement = () => {
  menuRef.value?.removeEventListener('keydown', trapKeydown, true);
  if (prevFocused && typeof prevFocused.focus === 'function') {
    prevFocused.focus();
  } else {
    triggerRef.value?.focus();
  }
  prevFocused = null;
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
  if (isOpen) {
    await nextTick();
    positionMenu();
    addListeners();
    startFocusManagement();
  } else {
    removeListeners();
    stopFocusManagement();
  }
});
onMounted(() => { if (props.open) { nextTick(positionMenu); addListeners(); startFocusManagement(); } });
onBeforeUnmount(() => { removeListeners(); stopFocusManagement(); });
</script>

<style scoped>
/* ---------- Montserrat in dieser Komponente erzwingen ---------- */
.phm-filter-btn,
.dropdown-menu,
.dropdown-item,
.menu-footer .btn{
  font-family: "Montserrat", system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif;
}

/* ---------- Einheitliche Trigger-Höhe ---------- */
.phm-filter-btn{
  height:56px;
  min-height:56px;
  padding: 1rem 1.5rem;
}
@media (max-width: 639px){
  .phm-filter-btn{
    height:52px;
    min-height:52px;
    padding: 1rem 1.25rem;
  }
}

/* ---------- Portal (Menü) ---------- */
.dropdown-portal {
  position: fixed; inset: 0;
  pointer-events: none;
  display: block;
  z-index: 230; /* über zentralem Overlay */
}
.dropdown-portal > .dropdown-menu { pointer-events: auto; }

/* Container/ Menü */
.dropdown-menu{
  position: fixed;
  box-shadow: 0 8px 16px rgba(0,0,0,.25);
  border-radius: .5rem;
  background: #1f1f1f;
  display: flex;
  flex-direction: column;
}
.menu-content{
  overflow-y: auto;
  padding: 16px;                /* <-- fehlende Abstände wieder da */
}

/* Footer */
.menu-footer{
  position: sticky;
  bottom: 0;
  padding: 12px 16px;
  background: #1f1f1f;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  border-bottom-left-radius: .5rem;
  border-bottom-right-radius: .5rem;
}

/* Button-Stil */
.btn { border-radius: .25rem; background-color: rgba(231,112,0,1); padding: .5rem 2rem; color:#fff; transition: all .15s cubic-bezier(0.4,0,0.2,1); }

/* Items + Hover + Counter */
.dropdown-item{ display:flex; justify-content:space-between; padding:8px; background:transparent; transition:background-color .3s,color .3s; cursor:pointer; }
.dropdown-item:hover{ background:#242424; border-radius:8px; }
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

/* Mobile Chevron offsets */
@media (max-width: 639px){ .mobile-chevron { margin-left: 10px; margin-top: 3px; } }
</style>
