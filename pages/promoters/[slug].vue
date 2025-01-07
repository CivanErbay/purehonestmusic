<template>
  <div>
    <DefaultGrid :no-spacing="true" class="mt-5 lg:mt-10 mb-8">
      <AtomContentCard
        class="lg:col-start-3 lg:col-end-11"
        :item="promoterData"
      />
      <h3 class="text-3xl mt-8 lg:mt-16 lg:col-start-3 lg:col-end-11">
        Mehr von {{ promoterData.name }}
      </h3>
    </DefaultGrid>

    <ItemList :items="concerts" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const { data } = await fetchCollectionHandler('promoters', route.params.slug);

const { data: promoterData } = useLivePreview({
  initialData: data.value,
  serverURL: import.meta.env.VITE_API_ENDPOINT,
  depth: 2,
});

const { data: concerts } = await fetchCollectionHandler(
  'concerts',
  null,
  1000,
  0,
  { where: { promoter: { equals: promoterData.value.id } } }
);
</script>
