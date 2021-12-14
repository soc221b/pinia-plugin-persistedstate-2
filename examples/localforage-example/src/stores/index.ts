import { Plugin } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import localforage from 'localforage'

const identity = <T>(_: T) => _
const simpleDeepCopy = <T>(value: T) => JSON.parse(JSON.stringify(value))

export const plugin: Plugin = (app) => {
  const pinia = createPinia()

  localforage.setDriver(localforage.INDEXEDDB)
  pinia.use(
    createPersistedStatePlugin({
      storage: {
        getItem: async (key) => {
          return localforage.getItem(key)
        },
        setItem: async (key, value) => {
          return localforage.setItem(key, value).then(() => void 0)
        },
        removeItem: async (key) => {
          return localforage.removeItem(key)
        },
      },
      serialize: (value) => simpleDeepCopy(value),
      deserialize: identity,
    }),
  )

  app.use(pinia)
}
