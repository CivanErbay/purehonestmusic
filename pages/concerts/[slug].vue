<!-- pages/concerts/[slug].vue -->
<template>
  <div>
    <ConcertDetailPage :item="concert" />

    <!-- Empfehlungen unter dem Detailblock (Wrapper nutzt shared Cache & blendet das aktuelle Konzert aus) -->
    <GlobalRecommendations
      :excludeSlug="concert?.slug || route.params.slug"
      headline="Unsere
        Konzertempfehlungen"
    />
  </div>
</template>

<script setup>
const route = useRoute()

// Aktuelles Konzert laden
const { data } = await fetchCollectionHandler('concerts', route.params.slug)

// Live Preview wie gehabt
const { data: concert } = useLivePreview({
  initialData: data.value,
  serverURL: import.meta.env.VITE_API_ENDPOINT,
  depth: 2,
})

// Optional: Cache für Landing/Empfehlungen hier vorwärmen (SSR-Vollständigkeit)
await useLanding()

// SEO bleibt wie bei dir
useHead({
  title: `${concert.value.name} live – Konzert am ${formattedDate(concert.value.date)} in KÖLN @ ${concert.value.venue?.name}`, // This is the title of the page.
  htmlAttrs: { lang: 'de' },
  meta: [
    {
      name: 'description',
      content: concert.value.subtitle, // This is the description of the page.
    },
    {
      property: 'og:title',
      content: `🎵 Besuche das Konzert von ${
        concert.value.name
      } am ${formattedDate(concert.value.date)}`, // This is the Open Graph title, used by Telegram for the title.
    },
    {
      property: 'og:description',
      content: concert.value.subtitle, // This is the Open Graph description, used by Telegram for the description.
    },
    {
      property: 'og:image',
      content:
        concert.value.heroImage.sizes?.medium?.url ||
        concert.value.heroImage.url, // This is the Open Graph image, used by Telegram for the image preview.
    },
    { property: 'twitter:card', content: concert.value.subtitle },
    {
      property: 'twitter:title',
      content: `🎵 Besuche das Konzert von ${
        concert.value.name
      } am ${formattedDate(concert.value.date)}`,
    },
    {
      property: 'twitter:description',
      content: concert.value.subtitle,
    },
    {
      property: 'twitter:image',
      content:
        concert.value.heroImage.sizes?.medium?.url ||
        concert.value.heroImage.url,
    },
    {
      name: 'keywords',
      content: [
        'Konzert',
        concert.value.name,
        concert.value.subtitle,
        concert.value.venue?.name,
        ...((concert.value.genres?.map((it) => it.name)) || []),
        concert.value.promoter?.name,
      ].join(', '),
    },
  ],
})
</script>
