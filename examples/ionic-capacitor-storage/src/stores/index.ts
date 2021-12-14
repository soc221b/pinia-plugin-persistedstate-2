import { Plugin } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

import { Storage } from '@capacitor/storage'
export const plugin: Plugin = (app) => {
  const pinia = createPinia()

  pinia.use(
    createPersistedStatePlugin({
      storage: {
        getItem: (key) => Storage.get({ key }).then(({ value }) => value),
        removeItem: (key) => Storage.remove({ key }),
        setItem: (key, value) => Storage.set({ key, value }),
      },
    })
  )

  app.use(pinia)
}
