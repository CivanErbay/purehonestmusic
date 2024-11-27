// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'de',
      },
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css', '~/assets/css/tailwind.css'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@nuxt/image', '@nuxtjs/seo', '@pinia/nuxt'],
  devServer: {
    port: process.env.VITE_ENVIRONMENT === 'dev' ? 3001 : 3000, // default to 3000 or 3001 if VITE_ENVIRONMENT is 'dev'
  },
  googleFonts: {
    families: {
      'Josefin+Sans': true,
    },
  },
});