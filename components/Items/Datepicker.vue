<template>
  <div class="dropdown relative text-lg font-thin" ref="triggerRef">
    <!-- Trigger -->
    <button
      class="phm-filter-btn rounded-lg align-middle border inline-flex items-center font-medium dropdown-hover"
      :class="[ open ? 'bg-bg-light border-primary' : 'bg-transparent border-bg-light' ]"
      @click="onOpenClick"
      type="button"
      :id="triggerId"
      :aria-expanded="open ? 'true' : 'false'"
      aria-haspopup="dialog"
      :aria-controls="menuId"
    >
      <!-- Immer statisch: 'Datum' (keine Anzeige des ausgewählten Datums im Trigger) -->
      <span class="pt-1 whitespace-nowrap">Datum</span>
      <svg
        :class="{ 'rotate-180': open, 'rotate-0': !open }"
        class="inline-block w-4 h-4 ml-[10px] mt-[4px] sm:ml-2 sm:mt-0 transition-transform duration-200"
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
          <!-- Header -->
          <div class="px-4 pt-4 pb-2">
            <div class="mb-2 grid grid-cols-[32px_1fr_32px] items-center">
              <!-- nutze goPrev/goNext, damit die Richtung für die Animation gesetzt wird -->
              <button class="h-8 w-8 rounded-lg text-white/90 hover:bg-white/10" @click="goPrev" aria-label="Vorheriger Monat">‹</button>
              <div class="text-center font-semibold" id="datepicker-month-label">{{ monthTitle }}</div>
              <button class="h-8 w-8 rounded-lg text-white/90 hover:bg-white/10" @click="goNext" aria-label="Nächster Monat">›</button>
            </div>
            <div class="grid grid-cols-7 gap-1.5 text-[12px] opacity-80" role="row">
              <div v-for="d in dow" :key="d" class="py-1 text-center" role="columnheader">{{ d }}</div>
            </div>
          </div>

          <!-- Kalender (aktueller Monat) mit Swipe -->
          <div class="px-4 pb-2" role="grid" aria-labelledby="datepicker-month-label">
            <div
              ref="swipeWrapRef"
              class="relative overflow-hidden swipe-wrap"
              @touchstart.passive="onTouchStart"
              @touchmove.passive="onTouchMove"
              @touchend="onTouchEnd"
              @touchcancel="onTouchCancel"
              @pointerdown.passive="onPointerDown"
              @pointermove.passive="onPointerMove"
              @pointerup="onPointerUp"
              @pointercancel="onPointerCancel"
            >
              <!-- Transition für Links/Rechts-Slide; Drag-Transform liegt auf dem Kind, damit sich die Styles nicht beißen -->
              <transition :name="transitionName" mode="out-in">
                <div :key="monthKey" class="month-frame">
                  <div class="grid grid-cols-7 gap-1.5" :style="dragStyle">
                    <!-- leere Offsets für Wochenstart -->
                    <div v-for="n in firstOffset" :key="'off-'+n" class="h-10" aria-hidden="true"></div>

                    <!-- Tage 1..N -->
                    <button
                      v-for="cell in days"
                      :key="cell.key"
                      type="button"
                      class="relative h-10 rounded-lg border border-transparent text-white transition-colors"
                      :class="[
                        !cell.hasConcert ? 'opacity-45 cursor-not-allowed' : 'opacity-100 hover:bg-[#242424] cursor-pointer',
                        cell.isToday ? 'border-[rgba(231,112,0,.55)]' : 'border-transparent',
                        cell.isSelected ? 'bg-[#e77000] hover:bg-[#e77000]' : ''
                      ]"
                      :disabled="!cell.hasConcert"
                      @click="select(cell.date)"
                      role="gridcell"
                      :aria-selected="cell.isSelected ? 'true' : 'false'"
                      :aria-disabled="!cell.hasConcert ? 'true' : 'false'"
                    >
                      <span class="relative inline-block">
                        {{ cell.day }}
                        <span v-if="cell.hasConcert" class="pointer-events-none absolute -right-1 h-1.5 w-1.5 rounded-full" style="background-color:#e77000; bottom:-1px;"></span>
                      </span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <!-- Footer -->
          <div class="menu-footer">
            <button type="button" class="btn w-full" @click="confirmAndClose(true)" aria-label="Datum übernehmen und schließen">
              Bestätigen
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  slug: { type: String, default: 'date' },
  selectedDate: { type: String, default: '' },
  open: { type: Boolean, default: false },
  availableDates: { type: Array, default: () => [] }
});
const emit = defineEmits(['update:date', 'update:toggle']);

const selected = ref(null);
const pad = (n) => String(n).padStart(2, '0');
const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const formatDE = (d) => `${pad(d.getDate())}.${pad(d.getMonth()+1)}.${d.getFullYear()}`;

const today = new Date(); today.setHours(0,0,0,0);
const viewYear  = ref(today.getFullYear());
const viewMonth = ref(today.getMonth());
const sameYMD = (a,b)=>a&&b&&a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate();

const availableSet = computed(()=> new Set(props.availableDates||[]));

const monthTitle = computed(()=> new Intl.DateTimeFormat('de-DE',{month:'long',year:'numeric'}).format(new Date(viewYear.value,viewMonth.value,1)));
const dow = ['Mo','Di','Mi','Do','Fr','Sa','So'];
const mondayIndex = d => (d.getDay()+6)%7;

const firstOfMonth = computed(() => new Date(viewYear.value, viewMonth.value, 1));
const firstOffset  = computed(() => mondayIndex(firstOfMonth.value)); // leere Zellen vor dem 1.
const daysInMonth  = computed(() => new Date(viewYear.value, viewMonth.value + 1, 0).getDate());

const days = computed(() => {
  const out = [];
  for (let d = 1; d <= daysInMonth.value; d++) {
    const date = new Date(viewYear.value, viewMonth.value, d);
    const iso  = toISO(date);
    out.push({
      key: iso,
      day: d,
      date,
      isToday: sameYMD(date, today),
      isSelected: selected.value ? sameYMD(date, selected.value) : false,
      hasConcert: availableSet.value.has(iso)
    });
  }
  return out;
});

/* --- Swipe & Animation --- */
const swipeWrapRef = ref(null);
const monthKey = computed(() => `${viewYear.value}-${viewMonth.value}`);

const direction = ref('left'); // 'left' für next, 'right' für prev
const transitionName = computed(() => direction.value === 'left' ? 'slide-left' : 'slide-right');

const swipe = reactive({
  active:false,
  startX:0,
  startY:0,
  dx:0,
  dy:0
});

// Thresholds
const Y_TOLERANCE = 40; // maximale vertikale Abweichung
const baseThreshold = 50;
const SWIPE_THRESHOLD_PCT = 0.18; // ~18% der Breite
const getSwipeThreshold = () => {
  const w = swipeWrapRef.value?.offsetWidth || 320;
  return Math.max(baseThreshold, Math.round(w * SWIPE_THRESHOLD_PCT));
};

const dragStyle = computed(() => ({
  transform: `translateX(${swipe.active ? swipe.dx : 0}px)`,
  transition: swipe.active ? 'none' : 'transform .25s ease'
}));

const startDrag = (x, y) => {
  swipe.active = true;
  swipe.startX = x;
  swipe.startY = y;
  swipe.dx = 0;
  swipe.dy = 0;
};

const moveDrag = (x, y) => {
  if (!swipe.active) return;
  swipe.dx = x - swipe.startX;
  swipe.dy = y - swipe.startY;
  if (Math.abs(swipe.dy) > Math.max(12, Math.abs(swipe.dx))) cancelDrag();
};

const endDrag = () => {
  if (!swipe.active) return;
  const dx = swipe.dx, dy = swipe.dy;
  cancelDrag();
  if (Math.abs(dx) > getSwipeThreshold() && Math.abs(dy) < Y_TOLERANCE) {
    dx < 0 ? goNext() : goPrev();
  }
};

const cancelDrag = () => { swipe.active = false; swipe.dx = 0; swipe.dy = 0; };

// Guard gegen doppelte Events (Touch + Pointer)
const usingPointer = ref(false);

/* Touch-Events */
const onTouchStart = (e) => { if (usingPointer.value) return; const t = e.touches && e.touches[0]; if (!t) return; startDrag(t.clientX, t.clientY); };
const onTouchMove  = (e) => { if (usingPointer.value) return; const t = e.touches && e.touches[0]; if (!t) return; moveDrag(t.clientX, t.clientY); };
const onTouchEnd   = () => { if (!usingPointer.value) endDrag(); };
const onTouchCancel= () => { if (!usingPointer.value) cancelDrag(); };

/* Pointer-Events (Fallback) */
const onPointerDown = (e) => { if (e.pointerType !== 'mouse') { usingPointer.value = true; startDrag(e.clientX, e.clientY); } };
const onPointerMove = (e) => { if (e.pointerType !== 'mouse') moveDrag(e.clientX, e.clientY); };
const onPointerUp   = (e) => { if (e.pointerType !== 'mouse') { endDrag(); usingPointer.value = false; } };
const onPointerCancel = (e) => { if (e.pointerType !== 'mouse') { cancelDrag(); usingPointer.value = false; } };

/* Navigation inkl. Richtung setzen */
const prevMonth = () => { if(viewMonth.value===0){ viewMonth.value=11; viewYear.value-=1; } else viewMonth.value-=1; };
const nextMonth = () => { if(viewMonth.value===11){ viewMonth.value=0; viewYear.value+=1; } else viewMonth.value+=1; };
const goPrev = () => { direction.value = 'right'; prevMonth(); };
const goNext = () => { direction.value = 'left';  nextMonth();  };

/* Positionierung */
const triggerRef = ref(null);
const menuRef = ref(null);
const menuStyle = reactive({
  position:'fixed', top:'0px', left:'0px',
  width:'342px', minWidth:'180px',
  maxHeight:'60vh',
  overflow:'hidden',
  zIndex: 1,
  backgroundColor:'#1f1f1f',
});

const triggerId = computed(() => `filter-${props.slug}-btn`);
const menuId    = computed(() => `filter-${props.slug}-menu`);

const getContainerRect = (el) => {
  const container = el.closest('.mx-auto') || document.documentElement;
  return container.getBoundingClientRect();
};
const positionMenu = () => {
  const t = triggerRef.value, m = menuRef.value; if(!t||!m) return;
  const r = t.getBoundingClientRect();
  const cr = getContainerRect(t);
  const vw = window.innerWidth, vh = window.innerHeight, gap=6;
  const isMobile = vw < 640;
  const top = r.bottom + gap;

  if (isMobile){
    menuStyle.left = `${cr.left}px`;
    menuStyle.width = `${cr.width}px`;
    menuStyle.minWidth = `${cr.width}px`;
    menuStyle.maxHeight = '465px';
  } else {
    const desired = Math.max(r.width, 342);
    let left = r.left;
    const maxLeft = vw - 8 - desired;
    if (left < 8) left = 8;
    if (left > maxLeft) left = maxLeft;
    menuStyle.left = `${left}px`;
    menuStyle.width = `${desired}px`;
    menuStyle.minWidth = `${desired}px`;
    const spaceBelow = vh - top - 8;
    const clamped = Math.max(300, Math.min(560, spaceBelow));
    menuStyle.maxHeight = `${clamped}px`;
  }
  menuStyle.top = `${top}px`;
};

const addListeners = ()=>{ window.addEventListener('resize', positionMenu, {passive:true}); window.addEventListener('scroll', positionMenu, {passive:true, capture:true}); };
const removeListeners = ()=>{ window.removeEventListener('resize', positionMenu); window.removeEventListener('scroll', positionMenu, {capture:true}); };

/* Interaktionen */
const onOpenClick = () => {
  emit('update:toggle', props.slug);
  requestAnimationFrame(() => {
    positionMenu();
    try {
      if (window.scrollY < 120 && triggerRef.value) {
        const r = triggerRef.value.getBoundingClientRect();
        const y = r.top + window.scrollY - 88;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } catch {}
  });
};

const select = (d)=>{ const iso = toISO(d); if(!availableSet.value.has(iso)) return; selected.value = new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
const confirmAndClose = () => { emit('update:date', selected.value ? toISO(selected.value) : ''); emit('update:toggle', props.slug); };

/* Sync von außen */
watch(()=>props.selectedDate, (val)=>{
  if(!val){ selected.value=null; viewYear.value=today.getFullYear(); viewMonth.value=today.getMonth(); return; }
  const [y,m,d]=val.split('-').map(Number); const parsed=new Date(y,(m||1)-1,d||1);
  if(!isNaN(parsed.getTime())){ selected.value=parsed; viewYear.value=parsed.getFullYear(); viewMonth.value=parsed.getMonth(); }
},{immediate:true});

watch(()=>props.open, async o=>{ if(o){ await nextTick(); positionMenu(); addListeners(); } else { removeListeners(); } });

onMounted(()=>{ if(props.open){ nextTick(positionMenu); addListeners(); }});
onBeforeUnmount(()=>{ removeListeners(); });

const open = computed(()=>props.open);
</script>

<style scoped>
/* Montserrat erzwingen (Trigger + Menü) */
.phm-filter-btn,
.dropdown-menu,
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

/* ---------- Portal ---------- */
.dropdown-portal {
  position: fixed; inset: 0;
  pointer-events: none;
  display: block;
  z-index: 230;
}
.dropdown-portal > .dropdown-menu { pointer-events: auto; }

.dropdown-menu{
  position: fixed;
  box-shadow: 0 8px 16px rgba(0,0,0,0.25);
  border-radius: .5rem;
  background: #1f1f1f;
  display: flex;
  flex-direction: column;
}

/* Footer */
.menu-footer{
  position: sticky;
  bottom: 0;
  padding: 12px 16px 14px 16px;
  background: #1f1f1f;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  border-bottom-left-radius: .5rem;
  border-bottom-right-radius: .5rem;
}

/* Button-Stil */
.btn { border-radius: .25rem; background-color: rgba(231,112,0,1); padding: .5rem 2rem; color:#fff; transition: all .15s cubic-bezier(0.4,0,0.2,1); }

/* Hover des Triggers */
.dropdown-hover{ border-radius:.5rem; transition:background-color .3s ease,color .3s ease; background:transparent; }
.dropdown-hover:hover{ border-radius:.5rem; background:#242424; color:#fff; }
.pt-1{ padding-top:1px; }

/* ---------- Swipe & Animation ---------- */
.swipe-wrap{
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

.month-frame{ will-change: transform; }

/* Slide nach links (nächster Monat) */
.slide-left-enter-from { transform: translateX(100%); }
.slide-left-leave-to   { transform: translateX(-100%); }
/* Slide nach rechts (vorheriger Monat) */
.slide-right-enter-from{ transform: translateX(-100%); }
.slide-right-leave-to  { transform: translateX(100%); }

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active{
  transition: transform .25s ease;
}
</style>
