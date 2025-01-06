<template>
  <div class="atom-media">
    <!-- <div
      v-if="!imageLoaded && !isVideo && !isFullWidth"
      class="placeholder bg-gray-300 overflow-hidden -z-10"
    ></div> -->
    <NuxtImg
      v-if="isImage"
      :src="src"
      :alt="alt"
      :title="alt"
      :style="imageStyle"
      :class="['w-full h-full', { 'object-cover': isCover, 'object-contain': !isCover }, customClasses]"
      :height="height"
      :width="width"
      format="webp"
      @load="handleMediaLoaded"
    />
  </div>
</template>

<script setup lang="ts">
import type { Media } from '../../types/Atoms';

const props = defineProps<Media & { customClasses?: string }>();
const emit = defineEmits<{
  (e: 'loaded', value: boolean): void;
}>();

const imageLoaded = ref(false);

function handleMediaLoaded() {
  imageLoaded.value = true;
  emit('loaded', imageLoaded.value);
}

const src = computed(() => {
  return props.sizes?.large?.url || props.url;
});

const isImage = computed(() => {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(props.url);
});

const isVideo = computed(() => {
  return /\.(mp4|webm|ogg)$/i.test(props.url);
});

const imageStyle = computed(() => {
  if (!isImage.value) return {};
  return {
    objectPosition: `${props.focalX}% ${props.focalY}%`,
  };
});
</script>

<style scoped>
.placeholder {
  background: #eee;
  position: absolute;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.placeholder:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  background: linear-gradient(90deg, #eee, #f4f4f4, #eee);
  animation: gradient 1s infinite ease-in-out;
}

@keyframes gradient {
  from {
    left: -50%;
  }
  to {
    left: 100%;
  }
}
</style>
