// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  srcDir: 'src/',
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@pinia/nuxt'
  ],
  
  css: ['~/assets/css/main.css'],

  // Configuración del módulo color-mode
  colorMode: {
    preference: 'light', // 'light' | 'dark' | 'system'
    fallback: 'light',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
    storage: 'cookie'
  },

  runtimeConfig: {
    secretKey: process.env.SECRET_KEY,
    public: {
      apiBase: process.env.API_BASE_URL,
    },
  },

  compatibilityDate: '2025-03-17',

  nitro: {
    preset: 'netlify',
  },

  typescript: {
    tsConfig: {
      configFile: 'tsconfig.app.json',
    },
  },

  app: {
    head: {
      link: [
        {
          rel: 'icon',
          href: '/favicon.ico',
          type: 'image/x-icon',
        },
      ],
    },
  },
})