<template>
  <div class="dropdown relative text-lg font-thin" ref="triggerRef">
    <!-- Trigger (einheitliche Höhe) -->
    <button
      class="phm-filter-btn bg-bg-light rounded-lg align-middle border inline-flex items-center font-medium dropdown-hover"
      :class="{ 'border-primary': open, 'border-bg-light': !open }"
      @click="onOpenClick"
      type="button"
    >
      <span class="pt-1 whitespace-nowrap">
        {{ selected ? formatDE(selected) : 'Datum' }}
      </span>
      <svg
        :class="{ 'rotate-180': open, 'rotate-0': !open }"
        class="inline-block w-4 h-4 ml-[10px] mt-[4px] sm:ml-2 sm:mt-0 transition-transform duration-200"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Teleport -->
    <teleport to="body">
      <transition name="fade-fast">
        <div v-if="open" class="phm-overlay" @click="confirmAndClose(false)"></div>
      </transition>

      <div v-if="open" class="dropdown dropdown-portal">
        <div ref="menuRef" class="dropdown-menu rounded-lg border border-[#1f1f1f] p-0" :style="menuStyle">
          <!-- Header -->
          <div class="px-4 pt-4 pb-2">
            <div class="mb-2 grid grid-cols-[32px_1fr_32px] items-center">
              <button class="h-8 w-8 rounded-lg text-white/90 hover:bg-white/10" @click="prevMonth" aria-label="Vorheriger Monat">‹</button>
              <div class="text-center font-semibold">{{ monthTitle }}</div>
              <button class="h-8 w-8 rounded-lg text-white/90 hover:bg-white/10" @click="nextMonth" aria-label="Nächster Monat">›</button>
            </div>
            <div class="grid grid-cols-7 gap-1.5 text-[12px] opacity-80">
              <div v-for="d in dow" :key="d" class="py-1 text-center">{{ d }}</div>
            </div>
          </div>

          <!-- Kalender (nur aktueller Monat) -->
          <div class="px-4 pb-2">
            <div class="grid grid-cols-7 gap-1.5">
              <!-- leere Offsets für Wochenstart -->
              <div v-for="n in firstOffset" :key="'off-'+n" class="h-10"></div>

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
              >
                <span class="relative inline-block">
                  {{ cell.day }}
                  <span v-if="cell.hasConcert" class="pointer-events-none absolute -right-1 h-1.5 w-1.5 rounded-full" style="background-color:#e77000; bottom:-1px;"></span>
                </span>
              </button>
            </div>
          </div>

          <!-- Footer -->
          <div class="menu-footer">
            <button type="button" class="btn w-full" @click="confirmAndClose(true)">
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

/* Positionierung */
const triggerRef = ref(null);
const menuRef = ref(null);
const menuStyle = reactive({
  position:'fixed', top:'0px', left:'0px',
  width:'342px', minWidth:'180px',
  maxHeight:'60vh',
  overflow:'hidden',               // Inhalt scrollt in den Sections
  zIndex: 1,
  backgroundColor:'#1f1f1f',
});

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

watch(()=>props.open, async o=>{ if(o){ await nextTick(); positionMenu(); addListeners(); } else { removeListeners(); } });

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

const prevMonth = () => { if(viewMonth.value===0){ viewMonth.value=11; viewYear.value-=1; } else viewMonth.value-=1; };
const nextMonth = () => { if(viewMonth.value===11){ viewMonth.value=0; viewYear.value+=1; } else viewMonth.value+=1; };

const select = (d)=>{ const iso = toISO(d); if(!availableSet.value.has(iso)) return; selected.value = new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
const confirmAndClose = () => { emit('update:date', selected.value ? toISO(selected.value) : ''); emit('update:toggle', props.slug); };

/* Sync von außen */
watch(()=>props.selectedDate, (val)=>{
  if(!val){ selected.value=null; viewYear.value=today.getFullYear(); viewMonth.value=today.getMonth(); return; }
  const [y,m,d]=val.split('-').map(Number); const parsed=new Date(y,(m||1)-1,d||1);
  if(!isNaN(parsed.getTime())){ selected.value=parsed; viewYear.value=parsed.getFullYear(); viewMonth.value=parsed.getMonth(); }
},{immediate:true});

onMounted(()=>{ if(props.open){ nextTick(positionMenu); addListeners(); }});
onBeforeUnmount(removeListeners);

const open = computed(()=>props.open);
</script>

<style scoped>
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

/* ---------- Overlay (Blur) ---------- */
.phm-overlay{
  position: fixed;
  inset: 0;
  z-index: 220;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  background: rgba(19,19,19,.60);
}
.fade-fast-enter-active, .fade-fast-leave-active{ transition: opacity .18s ease; }
.fade-fast-enter-from, .fade-fast-leave-to{ opacity: 0; }

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

/* Footer (ohne Border-Top, Blur, nur bottom corners) */
.menu-footer{
  position: sticky;
  bottom: 0;
  padding: 12px 16px 14px 16px;
  background: #1f1f1f;
  -webkit-backdrop-filter: blur(30px);
  backdrop-filter: blur(30px);
  border-top: none;
  border-bottom-left-radius: .5rem;
  border-bottom-right-radius: .5rem;
}

/* Button-Stil */
.btn { border-radius: .25rem; background-color: rgba(231,112,0,1); padding: .5rem 2rem; color:#fff; transition: all .15s cubic-bezier(0.4,0,0.2,1); }

.dropdown-hover{ border-radius:.5rem; transition:background-color .3s ease,color .3s ease; background:transparent; }
.dropdown-hover:hover{ border-radius:.5rem; background:#242424; color:#fff; }
.pt-1{ padding-top:1px; }
</style>
