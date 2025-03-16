// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      title: 'Ben Payne',
      htmlAttrs: {
        lang: 'en'
      }
    },
  },
  ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      MAILGUN_API_KEY: process.env.MAILGUN_API_KEY,
      WEBMASTER_EMAIL: process.env.WEBMASTER_EMAIL
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },

  modules: ['shadcn-nuxt'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }
})