# Nuxt bridge example

## Installation

```sh
npm add pinia @pinia/nuxt cookie js-cookie
npm add pinia-plugin-persistedstate-2
```

## Usage

```ts
// plugins/persistedstate.js
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import Cookies from 'js-cookie'
import cookie from 'cookie'

export default function (nuxtApp) {
  nuxtApp.$pinia.use(
    createPersistedStatePlugin({
      // plugin options goes here
      storage: {
        getItem: (key) => {
          // See https://nuxtjs.org/guide/plugins/#using-process-flags
          if (process.server) {
            const parsedCookies = cookie.parse(
              nuxtApp.ssrContext.req.headers.cookie,
            )
            return parsedCookies[key]
          } else {
            return Cookies.get(key)
          }
        },
        // Please see https://github.com/js-cookie/js-cookie#json, on how to handle JSON.
        setItem: (key, value) =>
          Cookies.set(key, value, { expires: 365, secure: false }),
        removeItem: (key) => Cookies.remove(key),
      },
    }),
  )
}
```

```js
// nuxt.config.js
import { defineNuxtConfig } from '@nuxt/bridge'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  modules: ['@pinia/nuxt'],

  plugins: ['@/plugins/persistedstate.js'],

  build: {
    transpile: [
      // necessary for nuxt bridge
      'pinia',
    ],
  },
})
```
