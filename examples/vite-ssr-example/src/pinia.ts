import { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import cookie from 'cookie'
import JsCookie from 'js-cookie'
import viteSSR from 'vite-ssr'

export default (
  hookParams: Parameters<Required<Parameters<typeof viteSSR>>['2']>['0'],
) => {
  const pinia = createPinia()

  pinia.use(
    createPersistedStatePlugin({
      // plugin options goes here
      storage: {
        getItem: (key) => {
          // See https://nuxtjs.org/guide/plugins/#using-process-flags
          if (import.meta.env.SSR) {
            const parsedCookies = cookie.parse(
              hookParams.request.headers.cookie,
            )
            return parsedCookies[key]
          } else {
            return JsCookie.get(key)
          }
        },
        // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
        setItem: (key, value) => {
          JsCookie.set(key, value, { expires: 365, secure: false })
        },
        removeItem: (key) => JsCookie.remove(key),
      },
    }),
  )

  hookParams.app.use(pinia)
}
