<template>
  <div class="rounded-xl overflow-hidden mb-8 lg:mb-0">
    <div class="flex bg-[#242424] rounded-lg relative h-full">
      <div v-if="item.heroImage" class="w-56 h-full">
        <!--  add hover:w-full for animation -->
        <div
          class="absolute z-10 left-0 inset-y-0 hidden md:block w-56 duration-300 transition-all"
        >
          <AtomMedia v-bind="item.heroImage" :isCover="true" class="h-full" />
        </div>
      </div>

      <div class="h-full flex flex-1 flex-col justify-between relative">
        <div class="flex flex-col py-10 px-6">
          <div class="relative w-full mb-4">
            <h4 class="text-3xl font-semibold text-text">
              {{ item.name }}
            </h4>
            <p v-if="item.date" class="text-primary">
              {{ weekDay(item.date) }}, {{ formattedDate(item.date) }}
            </p>
            <div
              class="flex absolute top-1/2 -translate-y-1/2 right-3 items-center justify-center"
            >
              <button
                class="rounded-full bg-primary bg-opacity-15 w-7 h-7 flex items-center justify-center mr-2"
              >
                <NuxtImg class="w-4 h-4" src="/share.svg" />
              </button>
              <button
                class="rounded-full bg-primary bg-opacity-15 w-7 h-7 flex items-center justify-center mr-2"
              >
                <NuxtImg class="w-4 h-4" src="/addCalendar.svg" />
              </button>
              <button
                class="rounded-full bg-primary bg-opacity-15 w-7 h-7 flex items-center justify-center"
                @click="() => toggleFavorite(item.id)"
              >
                <NuxtImg v-if="item.isUserFavorite" class="w-4 h-4" src="" />
                <NuxtImg v-else class="w-4 h-4" src="/heart.svg" />
              </button>
            </div>
          </div>
          <p class="text-sm text-white opacity-50 overflow-hidden">
            {{ item.subtitle }}
          </p>
          <!-- TODO make sure style is ok -->
          <UtilsRichTextRenderer :nodes="item.description" />
        </div>
        <div class="flex items-center text-white bg-bg-light">
          <div class="w-1/2 px-10 py-4">
            <!-- Conerts -->
            <div class="flex mb-2" v-if="item.date">
              <NuxtImg class="w-4 h-4" src="/calendar.svg" />
              <p class="ml-1 opacity-40">
                {{ weekDay(item.date) }}, {{ formattedDate(item.date) }}
              </p>
            </div>
            <NuxtLink
              class="flex mb-2"
              v-if="item.venue?.name"
              :to="`/locations/${item.venue.slug}`"
            >
              <NuxtImg class="w-4 h-4" src="/location.svg" />
              <p class="ml-1 opacity-40">{{ item.venue.name }}</p>
            </NuxtLink>
            <div class="flex" v-if="item.genres">
              <NuxtImg class="w-4 h-4" src="/music.svg" />
              <p class="ml-1 opacity-40">
                {{ item.genres.map((it) => it.name).join(', ') }}
              </p>
            </div>
            <!-- location venue -->
            <div v-if="item.address" class="flex">
              <NuxtImg class="w-4 h-4" src="/location.svg" />
              <div class="flex flex-col">
                <p class="ml-1 opacity-40">{{ item.address.street }}</p>
                <p class="ml-1 opacity-40">{{ item.address.zipCode }}</p>
                <p class="ml-1 opacity-40">{{ item.address.city }}</p>
                <NuxtLink
                  class="mt-2 ml-1 opacity-40 underline"
                  :to="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${item.name} ${item.address.street}, ${item.address.zipCode}, ${item.address.city}`
                  )}`"
                  target="_blank"
                >
                  In Maps öffnen
                </NuxtLink>
              </div>
              <div class="flex flex-col opacity-40 ml-8">
                <p class="">Folgen auf:</p>
                <NuxtLink class="underline" :to="item.website" target="_blank"
                  >Website</NuxtLink
                >
                <NuxtLink class="underline" :to="item.instagram" target="_blank"
                  >Instagram</NuxtLink
                >
              </div>
            </div>
          </div>
          <div class="flex flex-col items-end w-1/2 px-10 py-5">
            <p v-if="item.promoter" class="opacity-40">
              Eine
              <NuxtLink :to="item.promoter.website" class="underline">{{
                item.promoter.name
              }}</NuxtLink
              >-Show
            </p>
            <p v-if="item.price" class="text-lg text-primary">
              {{ item.price }} €
            </p>
            <p
              v-if="item.price"
              class="opacity-40 text-[8px] lg:text-[10p] text-right leading-3"
            >
              ggf. zzgl. Vorverkaufsgebühren <br class="hidden lg:block" />
              und Abwicklungskosten
            </p>
            <div v-if="item.ticketsLink" class="flex justify-center mt-3">
              <button @click="redirectToTicket" class="btn">
                Zum Ticketkauf
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({ item: Object });
defineEmits(['toggleFavorite']);

function toggleFavorite(id) {
  emit('toggleFavorite', id);
}
</script>

<style lang="scss" scoped></style>
