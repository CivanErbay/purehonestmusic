<template>
  <div>
    <ConcertDetailPage :item="concert" />
  </div>
</template>

<script setup>
const route = useRoute();
const { data } = await fetchCollectionHandler('concerts', route.params.slug);

// The hook will take over from here and keep the preview in sync with the changes you make.
// The `data` property will contain the live data of the document only when viewed from the Preview view of the Admin UI.
const { data: concert } = useLivePreview({
  initialData: data.value,
  serverURL: import.meta.env.VITE_API_ENDPOINT,
  depth: 2,
});
</script>
