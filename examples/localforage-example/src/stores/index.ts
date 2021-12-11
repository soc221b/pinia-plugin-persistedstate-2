import { Plugin } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import localforage from 'localforage'

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const plugin: Plugin = (app) => {
  const pinia = createPinia()

  pinia.use(
    createPersistedStatePlugin({
      storage: {
        getItem: async (key) => {
          const result = await localforage.getItem<string>(key)
          await sleep(1000)
          return result
        },
        setItem: async (key, value) => {
          const result = await localforage
            .setItem<string>(key, value)
            .then(() => void 0)
          await sleep(1000)
          return result
        },
        removeItem: async (key) => {
          const result = await localforage.removeItem(key)
          await sleep(1000)
          return result
        },
      },
    }),
  )

  app.use(pinia)
}
