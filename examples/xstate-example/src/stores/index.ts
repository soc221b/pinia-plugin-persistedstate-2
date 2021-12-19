import { Plugin } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from '../../../../'

export const plugin: Plugin = (app) => {
  const pinia = createPinia()

  pinia.use(createPersistedStatePlugin())

  app.use(pinia)
}
