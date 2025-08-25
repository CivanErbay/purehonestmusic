<template>
  <div class="dropdown relative text-lg font-thin" ref="triggerRef">
    <button
      class="p-4 sm:px-6 sm:py-4 bg-bg-light rounded-lg align-middle border inline-flex items-center font-medium dropdown-hover"
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

    <!-- TELEPORT: Overlay + Menü -->
    <teleport to="body">
      <!-- Blur-Overlay -->
      <transition name="overlay-fade">
        <div
          v-if="open"
          class="phm-blur-overlay"
          @click="closeViaOverlay"
          aria-hidden="true"
        />
      </transition>

      <!-- Menü -->
      <div v-if="open" class="dropdown dropdown-portal">
        <div ref="menuRef" class="dropdown-menu" :style="menuStyle">
          <!-- Header -->
          <div class="mb-2 grid grid-cols-[32px_1fr_32px] items-center px-4 pt-4">
            <button class="h-8 w-8 rounded-lg text-white/90 hover:bg-white/10" @click="prevMonth" aria-label="Vorheriger Monat">‹</button>
            <div class="text-center font-semibold">{{ monthTitle }}</div>
            <button class="h-8 w-8 rounded-lg text-white/90 hover:bg-white/10" @click="nextMonth" aria-label="Nächster Monat">›</button>
          </div>

          <!-- Kalender -->
          <div class="dropdown-scroll px-4 pb-2">
            <div class="grid grid-cols-7 gap-1.5">
              <div v-for="d in dow" :key="d" class="py-1 text-center text-[12px] opacity-80">{{ d }}</div>

              <button
                v-for="cell in cells"
                :key="cell.key"
                type="button"
                class="relative h-10 rounded-lg border border-transparent text-white transition-colors"
                :class="[
                  cell.hasConcert ? 'opacity-100 hover:bg-[#242424] cursor-pointer' : 'opacity-45 cursor-not-allowed',
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

const availableSet = computed(()=> new Set(props.availableDates||[]));
const monthTitle = computed(()=> new Intl.DateTimeFormat('de-DE',{month:'long',year:'numeric'}).format(new Date(viewYear.value,viewMonth.value,1)));
const dow = ['Mo','Di','Mi','Do','Fr','Sa','So'];

const daysInMonth = (y,m) => new Date(y, m+1, 0).getDate();

const cells = computed(()=>{
  // Nur echte Tage des aktuellen Monats
  const out = [];
  const dim = daysInMonth(viewYear.value, viewMonth.value);
  for(let day=1; day<=dim; day++){
    const d = new Date(viewYear.value, viewMonth.value, day);
    const iso = toISO(d);
    out.push({
      key: iso,
      date: d,
      day,
      isToday: d.toDateString() === today.toDateString(),
      isSelected: selected.value ? d.toDateString() === selected.value.toDateString() : false,
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
  zIndex: 1
});
const getContainerRect = (el) => {
  const container = el.closest('.mx-auto') || document.documentElement;
  return container.getBoundingClientRect();
};
const positionMenu = () => {
  const t = triggerRef.value, m = menuRef.value; if(!t||!m) return;
  const r = t.getBoundingClientRect();
  const cr = getContainerRect(t);
  const vw = window.innerWidth, gap=6;
  const isMobile = vw < 640;

  const top = r.bottom + gap;

  if (isMobile){
    menuStyle.left = `${cr.left}px`;
    menuStyle.width = `${cr.width}px`;
    menuStyle.minWidth = `${cr.width}px`;
  } else {
    const desired = Math.max(r.width, 342);
    let left = r.left;
    const maxLeft = vw - 8 - desired;
    if (left < 8) left = 8;
    if (left > maxLeft) left = maxLeft;
    menuStyle.left = `${left}px`;
    menuStyle.width = `${desired}px`;
    menuStyle.minWidth = `${desired}px`;
  }

  menuStyle.top = `${top}px`;
};

const addListeners = ()=>{ window.addEventListener('resize', positionMenu, {passive:true}); window.addEventListener('scroll', positionMenu, {passive:true, capture:true}); };
const removeListeners = ()=>{ window.removeEventListener('resize', positionMenu); window.removeEventListener('scroll', positionMenu, {capture:true}); };
watch(()=>props.open, async o=>{ if(o){ await nextTick(); positionMenu(); addListeners(); } else { removeListeners(); } });

const onOpenClick = () => {
  emit('update:toggle', props.slug);
  const wrap = document.querySelector('.filters-hs-wrap');
  if (wrap && window.scrollY < wrap.getBoundingClientRect().top + window.scrollY - 20) {
    const offset = (getComputedStyle(document.documentElement).getPropertyValue('--phm-navbar-h') || '64').replace('px', '');
    const target = wrap.getBoundingClientRect().top + window.scrollY - (parseInt(offset, 10) || 64) - 8;
    window.scrollTo({ top: target, behavior: 'smooth' });
  }
};
const closeViaOverlay = () => emit('update:toggle', null);
const confirmAndClose = () => emit('update:toggle', null);

const prevMonth = () => { if(viewMonth.value===0){ viewMonth.value=11; viewYear.value-=1; } else viewMonth.value-=1; };
const nextMonth = () => { if(viewMonth.value===11){ viewMonth.value=0; viewYear.value+=1; } else viewMonth.value+=1; };

const select = (d)=>{ const iso = toISO(d); if(!availableSet.value.has(iso)) return; selected.value = new Date(d.getFullYear(), d.getMonth(), d.getDate()); emit('update:date', iso); };
const clear = ()=>{ selected.value=null; emit('update:date',''); };

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
/* ---------- Overlay ---------- */
.phm-blur-overlay{
  position: fixed;
  inset: 0;
  z-index: 170; /* über Content & Reset-Button, unter Menü */
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
.dropdown-portal { position: fixed; inset: 0; pointer-events: none; display:block; z-index: 230; }
.dropdown-portal > .dropdown-menu { pointer-events: auto; }

.dropdown-menu{
  position: fixed;
  background: #1f1f1f;
  border-radius: 12px;
  border: 1px solid #1f1f1f;
  box-shadow: 0 18px 40px rgba(0,0,0,0.35);
  overflow: hidden;
}

/* Scrollbereich + Footer-Höhenlogik */
.dropdown-scroll{
  overflow-y: auto;
  max-height: calc(var(--phm-dropdown-height, 520px) - 68px); /* 68px Footer */
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
}

/* Hover für Trigger identisch wie andere Filter */
.dropdown-hover{ border-radius:.5rem; transition:background-color .3s ease,color .3s ease; background:transparent; }
.dropdown-hover:hover{ border-radius:.5rem; background:#242424; color:#fff; }
</style>
