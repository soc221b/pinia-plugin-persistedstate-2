import { Plugin } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import localforage from 'localforage'

export const plugin: Plugin = (app) => {
  const pinia = createPinia()

  pinia.use(
    createPersistedStatePlugin({
      storage: {
        getItem: async (key) => {
          return localforage.getItem<string>(key)
        },
        setItem: async (key, value) => {
          return localforage.setItem<string>(key, value).then(() => void 0)
        },
        removeItem: async (key) => {
          return localforage.removeItem(key)
        },
      },
    }),
  )

  app.use(pinia)
}
