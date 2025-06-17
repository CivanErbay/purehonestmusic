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
        ...concert.value.genres?.map((it) => it.name),
        concert.value.promoter?.name,
      ].join(', '),
    },
  ],
});
</script>
