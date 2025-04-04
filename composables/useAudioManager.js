// composables/useAudioManager.js
import { ref } from 'vue';

const audioRefs = ref({});
const currentPlayingId = ref(null);

export function useAudioManager() {
  const registerAudio = (id, el) => {
    if (el) audioRefs.value[id] = el;
  };

  const toggleAudio = (id) => {
    const currentAudio = audioRefs.value[id];
    if (!currentAudio) return;

    Object.entries(audioRefs.value).forEach(([otherId, audio]) => {
      if (otherId !== id && audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });

    if (currentPlayingId.value === id) {
      currentAudio.pause();
      currentPlayingId.value = null;
    } else {
      currentAudio.play();
      currentPlayingId.value = id;
    }
  };

  const isPlaying = (id) => currentPlayingId.value === id;

  return {
    registerAudio,
    toggleAudio,
    isPlaying,
  };
}
