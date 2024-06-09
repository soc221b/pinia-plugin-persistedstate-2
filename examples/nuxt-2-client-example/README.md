# Nuxt 2 client example

## Installation

```sh
npm add @nuxtjs/composition-api pinia @pinia/nuxt@0.2.1
npm add pinia-plugin-persistedstate-2
```

## Usage

```js
// plugins/persistedstate.js
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

```js
// nuxt.config.js
export default {
  buildModules: ['@nuxtjs/composition-api/module', '@pinia/nuxt'],

  plugins: ['@/plugins/persistedstate.js'],
}
```
