<template>
  <div class="mx-4 lg:mx-0 font-josefin">
    <div class="max-w-[2056px] mx-auto lg:px-16">
      <Navbar />
      <Suspense>
        <NuxtPage />
      </Suspense>
      <Footer />
      <transition name="fade">
        <CookieBanner
          v-if="showBanner"
          @acceptCookies="acceptCookies"
          @declineCookies="declineCookies"
          :data="data"
        />
      </transition>
    </div>
  </div>
</template>

<script setup>
const { data, status } = await fetchGlobalHandler('settings');

useSeoMeta({
  title: data.value.seoTitle,
  ogTitle: data.value.seoTitle,
  description: data.value.seoDescription,
  ogDescription: data.value.seoDescription,
  // ogImage: '',
});

const showBanner = ref(false);

onMounted(() => {
  if (localStorage.getItem('acceptedCookies')) {
    showBanner.value = false;
    loadGoogleAnalytics();
  } else if (localStorage.getItem('declinedCookies')) {
    showBanner.value = false;
  } else {
    showBanner.value = true;
  }
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
