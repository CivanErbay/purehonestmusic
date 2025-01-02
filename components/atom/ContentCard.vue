<template>
  <div class="rounded-xl overflow-hidden mb-8 lg:mb-0">
    <div class="flex bg-[#242424] rounded-lg relative h-full flex-col md:flex-row">
      <div v-if="item.heroImage" class="w-full h-32 md:w-56 md:h-full relative">
        <!--  add hover:w-full for animation -->
        <div class="absolute z-10 inset-0 duration-300 transition-all">
          <!-- fallback to artist image if no concert image -->
          <AtomMedia v-bind="item.heroImage ||
            (item.artist.length > 0 && item.artist[0].heroImage)
            " :isCover="true" class="h-full" />
        </div>
      </div>

      <div class="h-full flex flex-1 flex-col justify-between relative">
        <div class="flex flex-col py-10 px-4 md:px-6">
          <div class="relative w-full mb-4">
            <p v-if="item.date" class="text-primary">
              {{ weekDay(item.date) }}, {{ formattedDate(item.date) }}
            </p>
            <h4 class="text-3xl font-semibold text-text">
              {{ item.name }}
            </h4>
            <div class="flex mt-2 md:mt-0 md:absolute md:top-0 md:right-0 items-center md:justify-center">
              <button @click="handleShare"
                class="rounded-full bg-[#2F2F2F] w-7 h-7 flex items-center justify-center mr-2">
                <NuxtImg class="w-4 h-4 ml-[1px] mb-[1px]" src="/share.svg" />
              </button>
              <add-to-calendar-button v-if="item.date" class="flex items-center justify-center mr-2" :label="''"
                customCss="/calendar.css" buttonStyle="custom" hideTextLabelButton
                :name="`${item.name} @ ${item.venue.name}`" options="'Apple','Google'" :location="venueLocation"
                :startDate="dateTimeStrings[0]" :endDate="dateTimeStrings[0]" :startTime="dateTimeStrings[1]"
                :endTime="dateTimeStrings[2]" timeZone="Europe/Berlin">
                <NuxtImg class="w-4 h-4" src="/addCalendar.svg" />
              </add-to-calendar-button>

              <button v-if="
                route.path.startsWith('/concerts') ||
                route.path.startsWith('/locations')
              " :class="[
                'rounded-full w-7 h-7 flex items-center justify-center',
                item.isUserFavorite
                ? 'bg-[#2F2F2F]'
                : 'bg-[#2F2F2F]',
              ]" @click="() => toggleFavorite(item.id)">
                <NuxtImg v-if="item.isUserFavorite " class="w-4 h-4 mt-[1px]" src="/heart_default.svg" />
                <NuxtImg v-else class="w-4 h-4 mt-[1px]" src="/heart_active.svg" />
              </button>
            </div>
          </div>
          <p class="text-sm text-white mb-4 opacity-50 overflow-hidden customLineHight">
            {{ item.subtitle }}
          </p>
          <UtilsRichTextRenderer :customClasses="'text-sm customLineHight'" :nodes="item.description" />
        </div>
        <div class="flex flex-col md:flex-row items-center text-white bg-[#2F2F2F]">
          <div class="px-4 md:px-10 py-4 flex w-full">
            <!-- Conerts -->
            <div class="">
              <div class="flex mb-4 mt-2  " v-if="item.date">
                <NuxtImg class="w-4 h-4" src="/calendar.svg" />
                <p class="ml-1 opacity-40 text-xs">
                  {{ weekDay(item.date) }}, {{ formattedDate(item.date) }}
                </p>
              </div>
              <NuxtLink class="flex mb-4" v-if="item.venue?.name" :to="`/locations/${item.venue.slug}`">
                <NuxtImg class="w-4 h-4" src="/location.svg" />
                <p class="ml-1 opacity-40 text-xs">{{ item.venue.name }}</p>
              </NuxtLink>
              <div class="flex" v-if="item.genres">
                <NuxtImg class="w-4 h-4" src="/music.svg" />
                <p class="ml-1 opacity-40 text-xs">
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
                  <NuxtLink class="mt-2 ml-1 opacity-40 underline" :to="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    venueLocation
                  )}`" target="_blank">
                    In Maps öffnen
                  </NuxtLink>
                </div>
              </div>
            </div>
            <div v-if="
              route.path.startsWith('/promoters') ||
              route.path.startsWith('/locations')
            " class="flex flex-col opacity-40 ml-8 w-fit">
              <p class="">Folgen auf:</p>
              <NuxtLink class="underline" :to="item.website" target="_blank">Website</NuxtLink>
              <NuxtLink class="underline" :to="item.instagram" target="_blank">Instagram</NuxtLink>
            </div>
          </div>
          <div class="flex flex-col w-full items-start px-4 md:px-10 py-5 self-end">
            <!--<NuxtLink v-if="item.promoter" class="opacity-40 whitespace-nowrap text-sm"
              :to="`/promoters/${item.promoter.slug}`">
              Eine <span class="underline">{{ item.promoter.name }}</span>-Show
            </NuxtLink>-->
            <p v-if="item.price" class="text-lg md:text-2xl text-primary">
              {{ item.price }} €
            </p>
            <p v-if="item.price" class="opacity-40 font-light text-xs md:text-md text-left leading-4">
              ggf. zzgl. VVK-Gebühren<br class="hidden lg:block" />
              und Abwicklungskosten
            </p>
            <div class="flex justify-center mt-3" v-if="route.path.startsWith('/concerts')">
              <NuxtLink :to="item.ticketsLink">
                <button class="btn whitespace-nowrap" :disabled="!item.ticketsLink">
                  Zum Ticketkauf
                </button>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import 'add-to-calendar-button';

const route = useRoute();

const props = defineProps({ item: Object });
const emit = defineEmits(['toggleFavorite']);

function toggleFavorite(id) {
  emit('toggleFavorite', id);
}

const venueLocation = computed(() => {
  if (props.item.address) {
    return `${props.item.name}, ${props.item.address.street}, ${props.item.address.zipCode} ${props.item.address.city}`;
  } else if (props.item.venue) {
    return `${props.item.venue.name}, ${props.item.venue.address.street}, ${props.item.venue.address.zipCode} ${props.item.venue.address.city}`;
  }
});

// [date, time, time2]
const dateTimeStrings = computed(() => {
  if (props.item.date) {
    const date = new Date(props.item.date).toISOString().split('T');
    const date2 = new Date(
      new Date(props.item.date).getTime() + 2 * 60 * 60 * 1000
    )
      .toISOString()
      .split('T'); // 2 hours later
    return [date[0], date[1].slice(0, 5), date2[1].slice(0, 5)];
  }
  return;
});

function handleShare() {
  if (navigator.share) {
    navigator
      .share({
        title: document.title,
        url: window.location.href,
      })
      .then(() => {
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
  } else {
    console.log('Share not supported on this browser, do it the old way.');
  }
}

</script>

<style scoped>
.atcb-button {
  background-color: black;
}
</style>
