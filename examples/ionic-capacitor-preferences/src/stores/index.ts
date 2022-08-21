import { Plugin } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

import { Preferences } from '@capacitor/preferences'
export const plugin: Plugin = (app) => {
  const pinia = createPinia()

  pinia.use(
    createPersistedStatePlugin({
      storage: {
        getItem: (key) => Preferences.get({ key }).then(({ value }) => value),
        removeItem: (key) => Preferences.remove({ key }),
        setItem: (key, value) => Preferences.set({ key, value }),
      },
    })
  )

  app.use(pinia)
}
