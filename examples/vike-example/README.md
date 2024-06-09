# Vike example

## Installation

```sh
npm i pinia cookie js-cookie
npm i pinia-plugin-persistedstate-2
```

## Usage

```diff
// server/index.js

// ...
  app.get('*', async (req, res, next) => {
    const pageContextInit = {
+     cookie: req.headers.cookie,
      urlOriginal: req.originalUrl
    }
    const pageContext = await renderPage(pageContextInit)
    const { httpResponse } = pageContext
    if (!httpResponse) {
      return next()
    } else {
      const { body, statusCode, headers, earlyHints } = httpResponse
      if (res.writeEarlyHints) res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) })
      headers.forEach(([name, value]) => res.setHeader(name, value))
      res.status(statusCode)
      // For HTTP streams use httpResponse.pipe() instead, see https://vike.dev/stream
      res.send(body)
    }
  })
// ...
```

```diff
// renderer/app.js

import { createPinia } from 'pinia'
+ import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
+ import jsCookie from 'js-cookie'
+ import cookie from 'cookie'
import { createSSRApp } from 'vue'
import { setPageContext } from './usePageContext'

export { createApp }

function createApp(pageContext) {
  const { Page } = pageContext

  const app = createSSRApp(Page)

  const store = createPinia()
+ const installPersistedStatePlugin = createPersistedStatePlugin({
+   storage: {
+     getItem: (key) => {
+       if (pageContext.isHydration) {
+         return jsCookie.get(key)
+       } else {
+         const parsedCookies = cookie.parse(pageContext.cookie)
+         return parsedCookies[key]
+       }
+     },
+     setItem: (key, value) => {
+       jsCookie.set(key, value, { expires: 365, secure: false })
+     },
+     removeItem: (key) => {
+       jsCookie.remove(key)
+     },
+   },
+ })
+ store.use((context) => installPersistedStatePlugin(context))
  app.use(store)

  setPageContext(app, pageContext)

  return app
}
```
