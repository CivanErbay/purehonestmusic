// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon_16_16.png', sizes: '16x16' },
        { rel: 'icon', type: 'image/png', href: '/favicon_32_32.png', sizes: '32x32' },
      ],
      script: [{ src: '/preline.js', type: 'module', defer: true }],
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('add-'),
    },
  },
  build: {
    transpile: ['@vuepic/vue-datepicker']
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css', '~/assets/css/tailwind.css', '@vuepic/vue-datepicker/dist/main.css'],
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxtjs/seo',
    '@pinia/nuxt',
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
});
