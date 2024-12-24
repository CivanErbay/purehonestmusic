// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
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
      'montserrat+Sans': true,
      'josefin+Sans': true,
    },
  },
});
