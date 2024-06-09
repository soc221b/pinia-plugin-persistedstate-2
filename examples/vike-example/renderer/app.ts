import { createSSRApp, defineComponent, h } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import jsCookie from 'js-cookie'
import cookie from 'cookie'
import PageShell from './PageShell.vue'
import { setPageContext } from './usePageContext'
import type { Component, PageContext, PageProps } from './types'

export { createApp }

function createApp(
  Page: Component,
  pageProps: PageProps | undefined,
  pageContext: PageContext,
) {
  const PageWithLayout = defineComponent({
    render() {
      return h(
        PageShell,
        {},
        {
          default() {
            return h(Page, pageProps || {})
          },
        },
      )
    },
  })

  const app = createSSRApp(PageWithLayout)

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

  // Make pageContext available from any Vue component
  setPageContext(app, pageContext)

  return app
}
