export default defineNuxtConfig({
  compatibilityDate: '2026-02-07',
  modules: [
      '@nuxt/ui',
      '@nuxt/fonts',
      '@nuxtjs/ngrok',
      '@vercel/speed-insights',
      '@vercel/analytics'
  ],
  ngrok: {
    authtoken: process.env.NGROK_AUTH_TOKEN || '',
    schemes: ['http']
  },
  css: ['~/assets/css/main.css'],
  ssr: true,
  nitro: {
    preset: 'vercel'
  },
  runtimeConfig: {
    MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
    WEBMASTER_EMAIL: process.env.WEBMASTER_EMAIL,
    BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    DOWNLOAD_PASSWORDS: process.env.DOWNLOAD_PASSWORDS,
  },
  app: {
    head: {
      title: 'Ben Payne',
      htmlAttrs: {
        lang: 'en'
      }
    },
  },
  vite: {
    build: {
      sourcemap: false
    }
  }
})
