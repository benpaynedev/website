export default defineNuxtConfig({
  compatibilityDate: '2026-02-07',
  modules: [
      '@nuxt/ui',
      '@nuxtjs/ngrok'
  ],
  ngrok: {
    authtoken: process.env.NGROK_AUTH_TOKEN || '',
    schemes: ['http']
  },
  css: ['~/assets/css/main.css'],
  ssr: true,
  runtimeConfig: {
    public: {
      MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
      WEBMASTER_EMAIL: process.env.WEBMASTER_EMAIL
    }
  },
  app: {
    head: {
      title: 'Ben Payne',
      htmlAttrs: {
        lang: 'en'
      }
    },
  },
})
