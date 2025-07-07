export default defineNuxtConfig({
  css: ['~/assets/scss/main.scss'],
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', '@vueuse/nuxt'],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_URL,
      apiBaseSSRUrl: process.env.NUXT_PUBLIC_API_SSR_URL,
    },
  },
  googleFonts: {
    families: {
      'Nunito Sans': true,
      'Abhaya Libre': true,
      download: true,
      inject: true,
    },
  },
})
