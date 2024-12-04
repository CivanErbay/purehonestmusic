<template>
  <DefaultGrid :no-spacing="true" class="mb-5 mt-5 lg:mt-10">
    <AtomContentCard
      class="lg:col-start-3 lg:col-end-9 lg:mr-4"
      :item="item"
      @toggleFavorite="toggleFavoriteConcert"
    />
    <div class="lg:col-start-9 lg:col-end-11">
      <div class="rounded-xl overflow-hidden h-full flex flex-col">
        <div class="h-24 w-full relative">
          <AtomMedia
            class="w-full h-full blur-sm relative"
            :isCover="true"
            v-bind="item.heroImage"
          />
          <div
            class="w-24 z-20 h-24 overflow-hidden rounded-full top-full absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <AtomMedia
              class="w-full h-full"
              v-bind="item.heroImage"
              :isCover="true"
            />
          </div>
        </div>

        <div class="pt-12 flex flex-col h-full flex-1 z-10 bg-bg-light">
          <h6 class="text-center px-3 pt-3">{{ item.name }}</h6>
          <h5 class="opacity-70 text-sm text-center px-3">
            {{ item.genres.map((it) => it.name).join(', ') }}
          </h5>
          <div class="flex-1 px-3 mt-8 text-faded">Content</div>
          <div class="bg-red-400 h-36 p-3">Spotify embed</div>
        </div>
      </div>
    </div>
  </DefaultGrid>
</template>

<script setup>
const props = defineProps({ item: Object });

const redirectToTicket = () => {};

const usersStore = useUsersStore();
const { isConcertFavorite, toggleFavoriteConcert } = usersStore;

const item = computed(() => {
  return { ...props.item, isUserFavorite: isConcertFavorite(props.item.id) };
});
</script>
