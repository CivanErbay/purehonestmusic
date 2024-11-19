<template>
  <NuxtLink :to="`concerts/${item.slug}`">
    <div class="flex bg-[#242424] mb-5 rounded-lg relative break-all">
      <NuxtImg
        :src="item.heroImage.url"
        class="w-60 lg:w-36 h-auto object-cover rounded-l-lg"
      />
      <div
        class="flex flex-col lg:flex-row justify-between px-4 py-3 lg:px-6 lg:py-4 w-full"
      >
        <div class="flex flex-col justify-between w-full lg:w-2/3">
          <div class="flex flex-col mb-3">
            <h4 class="text-lg text-text">{{ item.name }}</h4>
            <p class="text-sm text-white opacity-50">
              {{ truncateSubtitle(item.subtitle) }}
            </p>
          </div>
          <div
            class="flex flex-col lg:flex-row lg:items-center text-white opacity-40 text-sm"
          >
            <div class="flex">
              <NuxtImg class="w-4 h-4" src="/calendar.svg" />
              <p class="ml-1">
                {{ weekDay(item.date) }}, {{ formattedDate(item.date) }}
              </p>
            </div>
            <div class="flex my-2 lg:my-0 lg:ml-6">
              <NuxtImg class="w-4 h-4" src="/location.svg" />
              <p class="ml-1">{{ item.location }}</p>
            </div>
            <div class="flex lg:ml-6">
              <NuxtImg class="w-4 h-4" src="/music.svg" />
              <p class="ml-1">
                {{ item.genres.map((it) => it.name).join(' ') }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col lg:items-end lg:justify-between text-white text-sm"
        >
          <div
            class="h-7 w-7 flex absolute top-3 right-4 lg:static items-center justify-center rounded-full bg-primary bg-opacity-15 mb-2"
          >
            <NuxtImg class="w-4 h-4" src="/heart.svg" />
          </div>

          <div class="flex flex-col items-end">
            <p v-if="item.promoter" class="opacity-40">
              Eine <span class="underline">{{ item.promoter.name }}</span
              >-Show
            </p>
            <p class="text-lg text-primary">{{ item.price }} €</p>
            <p class="opacity-40 text-[8px] lg:text-xs text-right">
              zzgl. Vorverkaufsgebühren <br class="hidden lg:block" />
              und ggf. Abwicklungskosten
            </p>
          </div>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
defineProps({ item: Object });
</script>

<style lang="scss" scoped></style>
