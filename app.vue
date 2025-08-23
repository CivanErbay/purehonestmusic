<template>
  <div class="mx-4 lg:mx-0 font-montserrat relative">
    <div class="max-w-[2056px] mx-auto lg:px-16">
      <Navbar />
      <NuxtPage />
      <Footer :settings="settings" />
      <transition name="fade">
        <CookieBanner
          v-if="showBanner"
          @accept-cookies="acceptCookies"
          @decline-cookies="declineCookies"
          :settings="settings"
        />
      </transition>
    </div>
    <transition name="fade">
      <div class="absolute z-50 inset-0 bg-bg" v-if="loading"></div>
    </transition>
  </div>
</template>

<script setup>
const { data: settings } = await fetchGlobalHandler('settings');

useSeoMeta({
  title: settings.value.seoTitle,
  ogTitle: settings.value.seoTitle,
  description: settings.value.seoDescription,
  ogDescription: settings.value.seoDescription,
  // ogImage: '',
});

useHead({
  title: settings.value.metaTitle,
  htmlAttrs: { lang: 'de' },
  meta: [
    { name: 'description', content: settings.value.metaDescription },
    { property: 'og:title', content: settings.value.metaTitle },
    { property: 'og:description', content: settings.value.metaDescription },
    {
      property: 'og:image',
      content:
        settings.value.socialMediaImage.sizes?.medium?.url ||
        settings.value.socialMediaImage.url,
    },
    { property: 'twitter:card', content: settings.value.socialMediaCard },
    { property: 'twitter:title', content: settings.value.socialMediaTitle },
    {
      property: 'twitter:description',
      content: settings.value.socialMediaDescription,
    },
    {
      property: 'twitter:image',
      content:
        settings.value.socialMediaImage.sizes?.medium?.url ||
        settings.value.socialMediaImage.url,
    },
    { name: 'keywords', content: settings.value.keywords },
  ],
});

const showBanner = ref(false);
const loading = ref(true);
const usersStore = useUserStore(); // needd to load the store

onMounted(() => {
  if (import.meta.client) {
    loading.value = false;
  }
  usersStore.loadFavorites();

  if (localStorage.getItem('acceptedCookies')) {
    showBanner.value = false;
    loadGoogleAnalytics();
    // Mouseflow wird beim Start vom Plugin geladen (weil acceptedCookies vorhanden)
  } else if (localStorage.getItem('declinedCookies')) {
    showBanner.value = false;
  } else {
    showBanner.value = true;
  }
});

const acceptCookies = () => {
  showBanner.value = false;
  localStorage.setItem('acceptedCookies', new Date());

  // >>> NEU: Plugin informieren – lädt Mouseflow sofort
  window.dispatchEvent(new CustomEvent('consent:analytics-granted'));

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
  function gtag(){ window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', 'G-BWMWPYMSMH', {
    page_path: window.location.pathname,
  });
};
</script>
