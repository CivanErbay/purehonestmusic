<script setup lang="ts">
import { ref, computed } from 'vue'

const firstName = ref('')
const email = ref('')
const interests = ref<string[]>([])
const giveawayOptIn = ref(false)
const hp = ref('')
const status = ref<'idle'|'ok'|'err'>('idle')
const loading = ref(false)

const genreOptions = [
  { label: 'Alle Genres',                       value: 'all_genres' },   // ← NEU (an erster Stelle)
  { label: 'Pop',                               value: 'pop' },
  { label: 'Rock',                              value: 'rock' },
  { label: 'Metal',                             value: 'metal' },
  { label: 'Jazz / Blues',                      value: 'jazz_blues' },
  { label: '(Post-)Punk / Hardcore',            value: 'post_punk_hardcore' },
  { label: 'Alternative / Indie',               value: 'alternative_indie' },
  { label: 'Singer-Songwriter / Folk / Acoustic', value: 'singer_folk_acoustic' },
  { label: 'Hip-Hop / Rap',                     value: 'hiphop_rap' },
  { label: 'R&B / Soul / Funk',                 value: 'rnb_soul_funk' },
  { label: 'Electronic / Dance',                value: 'electronic_dance' },
]

const isValidEmail = (v:string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const valid = computed(() => isValidEmail(email.value) && interests.value.length > 0)

// Toggle-Logik inkl. „Alle Genres“
function toggleInterest(slug:string){
  if (slug === 'all_genres') {
    // „Alle Genres“ an → alles andere aus; erneut klicken → alles aus
    if (interests.value.includes('all_genres')) {
      interests.value = []
    } else {
      interests.value = ['all_genres']
    }
    return
  }

  // Einzel-Genre toggeln
  const i = interests.value.indexOf(slug)
  if (i === -1) interests.value.push(slug)
  else interests.value.splice(i, 1)

  // Falls „Alle Genres“ aktiv war → abwählen
  const iAll = interests.value.indexOf('all_genres')
  if (iAll !== -1) interests.value.splice(iAll, 1)
}

async function submit(){
  if (loading.value || !valid.value) return
  loading.value = true
  status.value = 'idle'
  const res = await $fetch('/api/subscribe', {
    method: 'POST',
    body: {
      email: email.value,
      firstName: firstName.value,
      interests: interests.value,
      giveawayOptIn: giveawayOptIn.value,
      hp: hp.value
    }
  }).catch(() => ({ ok:false }))
  status.value = res?.ok ? 'ok' : 'err'
  loading.value = false
}
</script>

<template>
  <form
    @submit.prevent="submit"
    class="flex bg-[#242424] mb-12 rounded-xl overflow-hidden relative w-full"
    :aria-busy="loading ? 'true' : 'false'"
  >
    <div class="flex flex-col lg:grid lg:grid-cols-2 w-full">
      <!-- LINKS -->
      <div class="flex flex-col justify-between w-full pr-0 lg:pr-4 mb-3 mt-2 px-8 py-6 mr-4">
        <div class="flex flex-col mb-4 mr-4">
          <h4 id="newsletterHeading" class="text-2xl sm:text-3xl lg:text-4xl text-white font-semibold mb-2 !leading-[1.32]">
            Newsletter abonnieren:<br />
            Updates &amp; News direkt ins Postfach
            <span class="mail-emoji">✉️</span><br /><br />
          </h4>
          <div class="not-prose" aria-labelledby="newsletterHeading">
            <ul class="benefits-list mt-2 text-lg lg:text-base !list-none !pl-0 no-bullets space-y-6 [&_strong]:font-semibold">
              <li class="flex items-start gap-3">
                <span aria-hidden="true" class="inline-block w-7 text-[22px] leading-none translate-y-[2px]">✅</span>
                <span class="flex-1"><strong>Erhalte wöchentlich handverlesene Highlights</strong></span>
              </li>
              <li class="flex items-start gap-3">
                <span aria-hidden="true" class="inline-block w-7 text-[22px] leading-none translate-y-[2px]">✅</span>
                <span class="flex-1"><strong>Frühzeitig informiert</strong>: rechtzeitig planen &amp; Tickets sichern</span>
              </li>
              <li class="flex items-start gap-3">
                <span aria-hidden="true" class="inline-block w-7 text-[22px] leading-none translate-y-[2px]">✅</span>
                <span class="flex-1"><strong>Köln &amp; Newcomer*innen im Fokus</strong> – lokale Szene entdecken und supporten</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="hidden lg:flex flex-col gap-2 text-xs text-slate-200"></div>
      </div>

      <!-- RECHTS -->
      <div
        class="flex flex-col text-white text-sm bg-[#2F2F2F] w-full gap-4 px-4 py-3 -mr-4 -mb-3 mt-0 rounded-b-xl rounded-t-none lg:px-6 lg:py-4 lg:-mr-6 lg:-mb-4 lg:items-start lg:rounded-none"
      >
        <!-- Genre-Pills -->
        <fieldset class="m-0 p-0 border-0 w-full" :aria-invalid="interests.length === 0 ? 'true' : 'false'" aria-describedby="genreHelp">
          <legend class="sr-only">Genres auswählen</legend>
          <p id="genreHelp" class="text-white/60 text-lg mt-4 mb-4">Wähle deine Genres &amp; melde dich an.<br></p>

          <div class="flex flex-wrap gap-2 text-sm" role="group" aria-label="Genres">
            <label
              v-for="opt in genreOptions"
              :key="opt.value"
              class="inline-flex items-center cursor-pointer touch-manipulation select-none"
            >
              <input
                type="checkbox"
                class="sr-only peer"
                :value="opt.value"
                :checked="interests.includes(opt.value)"
                @change="toggleInterest(opt.value)"
              />
              <span
                class="pill px-4 py-2 border transition
                       bg-[#2B2B2B] border-[#2B2B2B] text-slate-200
                       peer-checked:bg-[#E77000] peer-checked:text-white peer-checked:border-[#E77000]
                       peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[#E77000]
                       hover:bg-[#303030] cursor-pointer touch-manipulation select-none"
              >
                {{ opt.label }}
              </span>
            </label>
          </div>
        </fieldset>

        <input
          v-model="firstName"
          type="text"
          placeholder="Vorname"
          class="phm-input w-full bg-white text-[#1a1a1a] placeholder-[#7a7a7a] mt-2 px-5 py-3 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E77000]"
          autocomplete="given-name"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Mail-Adresse"
          required
          class="phm-input w-full bg-white text-[#1a1a1a] placeholder-[#7a7a7a] px-5 py-3 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#E77000] mb-4"
          autocomplete="email"
          inputmode="email"
          :aria-invalid="email.length > 0 && !isValidEmail(email) ? 'true' : 'false'"
        />

        <!-- Gewinnspiel-Opt-in -->
        <label class="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" v-model="giveawayOptIn" class="custom-checkbox mr-0 flex-shrink-0" />
          <span class="leading-5">Ich möchte über Ticket-Verlosungen informiert werden.</span>
        </label>

        <!-- Pflicht-Einwilligung Newsletter -->
        <label class="flex items-start gap-3 mb-4 cursor-pointer select-none">
          <input type="checkbox" required class="custom-checkbox mt-[2px] mr-0 flex-shrink-0" />
          <span class="text-xs text-white/80 leading-snug">
            Ich möchte den Newsletter von PURE.HONEST.MUSIC erhalten und per E-Mail über Highlights, Aktionen und Neuigkeiten informiert werden.
            Diese Einwilligung kann ich jederzeit am Ende jeder E-Mail widerrufen. Mehr dazu hier:
            <a href="https://www.purehonestmusic.com/datenschutz#mailerlite" class="underline hover:opacity-80" rel="noopener">Datenschutzhinweise</a>
          </span>
        </label>

        <button
          type="submit"
          :disabled="loading || !valid"
          class="btn w-[280px] self-start flex items-center justify-center text-center font-semibold mb-8 hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          :aria-disabled="(loading || !valid) ? 'true' : 'false'"
          aria-controls="formStatus"
        >
          {{ loading ? 'Senden…' : 'Anmelden' }}
        </button>

        <p id="formStatus" class="sr-only" :role="status==='err' ? 'alert' : 'status'" :aria-live="status==='err' ? 'assertive' : 'polite'">
          {{
            status==='ok'
              ? 'Du hast eine E-Mail erhalten '
              : status==='err'
                ? 'Leider hat’s nicht geklappt. Versuch’s später erneut.'
                : ''
          }}
        </p>
      </div>
    </div>

    <!-- Honeypot -->
    <input v-model="hp" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden" />
  </form>

  <p v-if="status==='ok'" class="text-green-400 px-4 lg:px-6 -mt-4 mb-6 text-center">Fast geschafft 😊 Bitte bestätige deine Anmeldung – klicke auf den Link in der E-Mail, die du soeben erhalten hast!</p>
  <p v-else-if="status==='err'" class="text-red-400 px-4 lg:px-6 -mt-4 mb-6 text-center">😲 Leider hat’s nicht geklappt. Versuch’s später erneut.</p>
</template>

<style scoped>
.btn { border-radius: .25rem; background-color: rgba(231,112,0,1); padding: .5rem 2rem; color:#fff; transition: all .15s cubic-bezier(0.4,0,0.2,1); }
.phm-input { border-radius: .25rem; }
.pill { border-radius: .25rem; line-height: 1.25rem; display: inline-flex; align-items: center; }

.custom-checkbox{
  width: 20px; height: 20px; appearance: none; -webkit-appearance: none;
  background-color: #fff; border: 1px solid #1f1f1f; border-radius: 0; position: relative;
  cursor: pointer; outline: none; transition: background-color .15s, border-color .15s, box-shadow .15s;
}
.custom-checkbox:focus-visible{ box-shadow: 0 0 0 3px rgba(231,112,0,.35); border-color: #E77000; }
.custom-checkbox:checked{ background-color: #E77000; border-color: #E77000; }
.custom-checkbox:checked::after{
  content: ""; position: absolute; left: 50%; top: 50%; width: 7px; height: 12px;
  border: solid #fff; border-width: 0 2px 2px 0; transform: translate(-50%, -55%) rotate(45deg);
}

ul.no-bullets, .prose ul.no-bullets { list-style: none !important; padding-left: 0 !important; margin-left: 0 !important; }
ul.no-bullets > li::marker { content: "" !important; }

.mail-emoji{ display: inline-block; transform-origin: 0% 100%; transform: rotate(-45deg); animation: mail-wobble-left 2.4s ease-in-out infinite; will-change: transform; margin-left: 18px; }
@media (min-width: 1024px){ .mail-emoji{ margin-left: 24px; margin-top: 10px; font-size: calc(1em - 3px); } }
@keyframes mail-wobble-left { 0%{transform: rotate(-45deg);} 12%{transform: rotate(-55deg);} 24%{transform: rotate(-45deg);} 36%{transform: rotate(-35deg);} 48%{transform: rotate(-45deg);} 70%{transform: rotate(-45deg);} 100%{transform: rotate(-45deg);} }
@media (prefers-reduced-motion: reduce) { .mail-emoji { animation: none; } }
:deep(.benefits-list) :is(strong, b){ font-weight: 600 !important; }
</style>
