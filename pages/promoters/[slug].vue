<template>
  <div>
    <DefaultGrid :no-spacing="true" class="mt-5 lg:mt-10 mb-8">
      <AtomContentCard
        class="lg:col-start-3 lg:col-end-11"
        :item="promoterData"
      />
    </DefaultGrid>
    <!-- TODO fit headline in grid -->
    <h3 class="text-3xl">{{ promoterData.name }}</h3>
    <ItemList :items="concerts" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

const { data: promoterData } = await fetchCollectionHandler(
  'promoters',
  route.params.slug
);

const { data: concerts } = await fetchCollectionHandler(
  'concerts',
  null,
  1000,
  0,
  { where: { promoter: { equals: promoterData.value.id } } }
);
</script>
