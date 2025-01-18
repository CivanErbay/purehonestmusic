export default defineNuxtConfig({
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon_16_16.png',
          sizes: '16x16',
        },
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon_32_32.png',
          sizes: '32x32',
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '192x192',
          href: '/android-chrome-192x192.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '512x512',
          href: '/android-chrome-512x512.png',
        },
      ],
      meta: [
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: '#131313' },
        { name: 'theme-color', content: '#131313' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, viewport-fit=cover',
        }, // Hinzugefügt
      ],
      // script: [{ src: '/preline.js', type: 'module', defer: true }],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('add-'),
    },
  },
  build: {
    transpile: ['@vuepic/vue-datepicker'],
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/tailwind.css',
    '@vuepic/vue-datepicker/dist/main.css',
  ],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
  ],
  plugins: ['~/plugins/vue-datepicker'],
  devServer: {
    port: process.env.VITE_ENVIRONMENT === 'dev' ? 3001 : 3000, // default to 3000 or 3001 if VITE_ENVIRONMENT is 'dev'
  },
  googleFonts: {
    families: {
      Montserrat: true, // Richtig, ohne Anführungszeichen oder `+`
      'Josefin Sans': true, // Richtig, mit Leerzeichen statt `+`
    },
    display: 'swap', // Optional: Vermeidet FOUC (Flash of Unstyled Content)
  },
  pwa: {
    manifest: {
      name: 'PURE.HONEST.MUSIC',
      short_name: 'PURE.HONEST.MUSIC',
      lang: 'de',
      display: 'standalone',
      start_url: '/',
      background_color: '#000000',
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: ({ url }) =>
            url.pathname.match(/\.(?:png|jpg|jpeg|svg|gif|mp4|webp)$/), // Function for media files
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'media-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
            },
            cacheableResponse: {
              statuses: [0, 200], // Cache responses with 200 or opaque status
            },
          },
        },
      ],
    },
  },
});
