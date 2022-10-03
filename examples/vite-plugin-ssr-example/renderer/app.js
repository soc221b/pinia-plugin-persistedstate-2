import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import { createSSRApp } from 'vue'
import { setPageContext } from './usePageContext'
import jsCookie from 'js-cookie'
import cookie from 'cookie'

export { createApp }

function createApp(pageContext) {
  const { Page } = pageContext

  const app = createSSRApp(Page)

  const store = createPinia()
  const installPersistedStatePlugin = createPersistedStatePlugin({
    storage: {
      getItem: (key) => {
        if (pageContext.isHydration) {
          return jsCookie.get(key)
        } else {
          const parsedCookies = cookie.parse(pageContext.cookie)
          return parsedCookies[key]
        }
      },
      setItem: (key, value) => {
        jsCookie.set(key, value, { expires: 365, secure: false })
      },
      removeItem: (key) => {
        jsCookie.remove(key)
      },
    },
  })
  store.use((context) => installPersistedStatePlugin(context))
  app.use(store)

  setPageContext(app, pageContext)

  return app
}
