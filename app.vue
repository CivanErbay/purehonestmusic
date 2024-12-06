<template>
  <div class="mx-4 lg:mx-0 font-josefin">
    <div class="max-w-[2056px] mx-auto lg:px-16">
      <Navbar />
      <Suspense>
        <NuxtPage />
      </Suspense>
      <Footer :settings="settings" />
      <transition name="fade">
        <CookieBanner
          v-if="showBanner"
          @acceptCookies="acceptCookies"
          @declineCookies="declineCookies"
          :settings="settings"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
const { data: settings, status } = await fetchGlobalHandler('settings');

useSeoMeta({
  title: settings.value.seoTitle,
  ogTitle: settings.value.seoTitle,
  description: settings.value.seoDescription,
  ogDescription: settings.value.seoDescription,
  // ogImage: '',
});

useHead({
  title: 'Pure Honest Music',
  htmlAttrs: { lang: 'de' },
  meta: [
    {
      name: 'description',
      content: 'Besuche noch heute beindruckende Konzerte in Köln',
    },
    {
      property: 'og:title',
      content: 'Pure Honest Music',
    },
    {
      property: 'og:description',
      content: 'Besuche noch heute beindruckende Konzerte in Köln',
    },
    // {
    //   property: 'og:image',
    //   content: 'https://www.purehonestmusic.com/images/og-image.jpg',
    // },
    { property: 'twitter:card', content: 'Pure Honest Music' },
    { property: 'twitter:title', content: 'PHM' },
    {
      property: 'twitter:description',
      content: 'Besuche noch heute beindruckende Konzerte in Köln',
    },
    // {
    // property: 'twitter:image',
    //   content: 'https://www.purehonestmusic.com/images/og-image.jpg',
    // },
    {
      name: 'keywords',
      content: 'concerts, music, live, bands, köln, germany, konzerte, musik',
    },
  ],
});

const showBanner = ref(false);
const { loadFavorites } = useUsersStore(); // needd to load the store

onMounted(() => {
  if (localStorage.getItem('acceptedCookies')) {
    showBanner.value = false;
    loadGoogleAnalytics();
  } else if (localStorage.getItem('declinedCookies')) {
    showBanner.value = false;
  } else {
    showBanner.value = true;
  }
  loadFavorites();
});

const acceptCookies = () => {
  showBanner.value = false;
  localStorage.setItem('acceptedCookies', new Date());
  loadGoogleAnalytics();
};

const declineCookies = () => {
  showBanner.value = false;
  localStorage.setItem('declinedCookies', new Date());
};

const loadGoogleAnalytics = () => {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=G-BWMWPYMSMH`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'G-BWMWPYMSMH', {
    page_path: window.location.pathname,
  });
};
</script>
