import { ref, onMounted, onUnmounted } from 'vue';
import { subscribe, unsubscribe, ready } from '@payloadcms/live-preview';

export const useLivePreview = (props) => {
  const { apiRoute, depth, initialData, serverURL } = props;
  const data = ref(initialData);
  const isLoading = ref(true);
  const hasSentReadyMessage = ref(false);

  const onChange = (mergedData) => {
    data.value = mergedData;
    isLoading.value = false;
  };

  let subscription;

  onMounted(() => {
    subscription = subscribe({
      apiRoute,
      callback: onChange,
      depth,
      initialData,
      serverURL,
    });

    if (!hasSentReadyMessage.value) {
      hasSentReadyMessage.value = true;
      ready({ serverURL });
    }
  });

  onUnmounted(() => {
    unsubscribe(subscription);
  });

  return {
    data,
    isLoading,
  };
};
