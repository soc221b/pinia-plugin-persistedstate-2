# Nuxtjs client example

## Installation

```sh
yarn add @nuxtjs/composition-api pinia @pinia/nuxt
yarn add pinia-plugin-persistedstate-2
```

## Usage

```js
// plugins/persistedstate.client.js
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

export default function ({ $pinia }) {
  if (process.client) {
    $pinia.use(
      createPersistedStatePlugin({
        // plugin options goes here
      }),
    )
  }
}
```

```diff
// nuxt.config.js
export default {
  buildModules: [
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ],

  plugins: [
+   '@/plugins/persistedstate.client.js',
  ],
}
```
