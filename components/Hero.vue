<template>
  <DefaultGrid :no-spacing="true">
    <div class="xl:col-start-1 xl:col-end-13 relative">
      <div class="bg-cover bg-center h-[167px] lg:h-[361px] contrast-125 flex items-center rounded-xl"
        :style="backgroundStyles">
        <div class="absolute inset-0 bg-black opacity-50 rounded-xl"></div>
        <DefaultGrid :no-spacing="true" class="relative z-10">
         <h3
            class="xl:col-start-2 xl:col-end-11
                   text-[clamp(1.5rem,calc(1.05rem+1.6vw),3.75rem)]
                   leading-[clamp(1.2,1.12+0.2vw,1.28)]
                   w-2/3 dynamicElementHeight2 xl:w-full
                   ml-[clamp(1.25rem,5vw,2.5rem)] xl:ml-0
                   lg:whitespace-normal font-bold"
          >
            {{ title }}
            <br class="hidden lg:block" />
            {{ subtitle }}
          </h3>
        </DefaultGrid>
      </div>
    </div>
  </DefaultGrid>
</template>

<script setup lang="ts">
import type { Media } from '../types/Atoms';

const props = defineProps({
  media: {
    type: Object as () => Media,
  },
  title: String,
  subtitle: String,
});
const img = useImage();
const backgroundStyles = computed(() => {
  const imgUrl = img(props.media?.sizes?.large.url || props.media.url, {
    width: 1200,
  });
  return { backgroundImage: `url('${imgUrl}')` };
});
</script>
