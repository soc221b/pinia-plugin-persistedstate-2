import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import Cookies from 'js-cookie'
import cookie from 'cookie'

export default defineNuxtPlugin(({ $pinia, ssrContext }) => {
  $pinia.use(
    createPersistedStatePlugin({
      storage: {
        getItem: (key) => {
          if (import.meta.server) {
            const str = ssrContext?.event.headers.get('cookie')
            if (!str) return
            const parsedCookies = cookie.parse(str)
            return parsedCookies[key]
          } else {
            return Cookies.get(key)
          }
        },
        setItem: (key, value) => {
          Cookies.set(key, value, { expires: 365, secure: false })
        },
        removeItem: (key) => Cookies.remove(key),
      },
    }),
  )
})
