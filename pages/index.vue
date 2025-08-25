<template>
  <div class="w-full">
    <Hero
      :media="landing.media"
      :title="landing.title"
      :subtitle="landing.subtitle"
    />
    <ConcertFilter :venues="venues" :genres="genres" :promoters="promoters" />
    <FilteredItemList />

    <!-- Empfehlungen: jetzt über den Wrapper (zieht aus dem Cache) -->
    <GlobalRecommendations
      headline="Unsere
        Konzertempfehlungen"
    />

    <!--
    <Recommendations
      :items="landing.highlightedConcerts"
      headline="Unsere
        Konzertempfehlungen"
    />
    -->

    <!--<Recommendations
      v-if="
        landing.genreConcerts1 && landing.genreConcerts1.concerts.length > 2
      "
      :items="landing.genreConcerts1.concerts"
      :headline="`Top Konzerte aus dem Genre: ${landing.genreConcerts1.genre.name}`"
    />
    <Recommendations
      v-if="
        landing.genreConcerts2 && landing.genreConcerts2.concerts.length > 2
      "
      :items="landing.genreConcerts2.concerts"
      :headline="`Top Konzerte aus dem Genre: ${landing.genreConcerts2.genre.name}`"
    />-->

    <DefaultGrid :no-spacing="true" class="gap-x-4 xl:gap-x-6">
      <div class="xl:col-start-2 xl:col-end-12">
        <SubscribeForm />
      </div>
    </DefaultGrid>

    <AboutBox />
  </div>
</template>

<script setup>
const concertStore = useConcertStore()
concertStore.loadConcerts()

const venuesPromise = fetchCollectionHandler('venues')
const genresPromise = fetchCollectionHandler('genres')
const promotersPromise = fetchCollectionHandler('promoters')

// Landing jetzt über Composable (shared Cache)
const { data: landing } = await useLanding()

const { data: venues } = await venuesPromise
const { data: genres } = await genresPromise
const { data: promoters } = await promotersPromise

// console.log({ concerts, venues, genres, promoters, landing })
</script>
