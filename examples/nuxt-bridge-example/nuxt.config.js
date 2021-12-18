import { defineNuxtConfig } from '@nuxt/bridge'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  buildModules: ['@pinia/nuxt'],

  plugins: ['@/plugins/persistedstate.js'],

  build: {
    transpile: [
      // necessary for nuxt bridge
      'pinia',
    ],
  },
})
