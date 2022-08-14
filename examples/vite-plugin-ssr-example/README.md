# Vue 2 example

## Installation

```sh
pnpm add pinia-plugin-persistedstate-2
```

## Usage

```diff
// renderer/app.js
import { createPinia } from 'pinia'
+ import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import { createSSRApp, h, reactive, markRaw } from 'vue'
import { setPageContext } from './usePageContext'

export { createApp }

function createApp(pageContext) {
  let rootComponent
  const app = createSSRApp({
    data: () => ({
      Page: markRaw(pageContext.Page),
      pageProps: markRaw(pageContext.pageProps || {}),
    }),
    render() {
      return h(this.Page, this.pageProps)
    },
    created() {
      rootComponent = this
    },
  })

  const store = createPinia()
+ if (pageContext.isHydration) {
+   const installPersistedStatePlugin = createPersistedStatePlugin()
+   store.use((context) => installPersistedStatePlugin(context))
+ }
  app.use(store)

  // We use `app.changePage()` to do Client Routing, see `_default.page.client.js`
  Object.assign(app, {
    changePage: (pageContext) => {
      Object.assign(pageContextReactive, pageContext)
      rootComponent.Page = markRaw(pageContext.Page)
      rootComponent.pageProps = markRaw(pageContext.pageProps || {})
    },
  })

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `_default.page.client.js`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext)

  setPageContext(app, pageContextReactive)

  return { app, store }
}
```
