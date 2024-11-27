<template>
  <DefaultGrid :no-spacing="true" class="mb-5 mt-5 lg:mt-10">
    <div class="lg:col-start-3 lg:col-end-11 rounded-xl overflow-hidden lg:mr-4 mb-8 lg:mb-0">
      <div class="flex bg-[#242424] rounded-lg relative h-full">
        <div class="w-56 h-full">
          <!-- <AtomMedia v-bind="" :isCover="true" class="h-full" /> -->
        </div>

        <div class="h-full flex-col justify-between relative">
          <div class="flex flex-col py-10 px-6">
            <div class="relative w-full mb-4">
              <h4 class="text-3xl font-semibold text-text">
                Gebäude 9
              </h4>

              <div class="flex absolute top-1/2 -translate-y-1/2 right-3 items-center justify-center">
                <button class="rounded-full bg-primary bg-opacity-15 w-7 h-7 flex items-center justify-center mr-2">
                  <NuxtImg class="w-4 h-4" src="/share.svg" />
                </button>
                <button class="rounded-full bg-primary bg-opacity-15 w-7 h-7 flex items-center justify-center">
                  <NuxtImg class="w-4 h-4" src="/heart.svg" />
                </button>
              </div>
            </div>
            <p class="text-sm text-white opacity-40 overflow-hidden mb-3 ">
              Cassels ist eine britische Band, die intelligenten Noise-Rock mit introspektiven und sozialkritischen
              Texten zu einem rauen und experimentellen Sound verschmilzt.
            </p>
            <p class="text-sm text-white opacity-80 overflow-hidden ">
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
              et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
              Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit
              amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
              aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
              gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
              sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
              voluptua. At vero eos et accusam et justo duo a kasd gubergren, no sea takimata sanctus est Lorem ipsum
              dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr.
            </p>
          </div>
          <div class="flex text-xs bg-bg-light">
            <div class="flex items-center text-white">
              <div class="w-1/2 px-10 py-4">
                <div class="flex items-start mt-4">
                  <NuxtImg class="w-4 h-4" src="/location.svg" />
                  <p class="ml-1 opacity-40">Deutz-Mülheimer Straße 117 51063 Köln</p>
                </div>

              </div>
            </div>
            <div class="flex flex-col py-4">
              <p class="opacity-40">Folgen auf:</p>
              <NuxtImg src="/instagram.svg" class="w-4 h-4 opacity-80" />
            </div>
          </div>
        </div>
      </div>
    </div>

  </DefaultGrid>
</template>

<script setup>
const props = defineProps({ item: Object });

const redirectToTicket = () => {
  console.log('blub');
};
</script>

<style scoped>
p {
  line-height: 26px;
}
</style>
