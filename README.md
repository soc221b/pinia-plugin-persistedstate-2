# pinia-plugin-persistedstate-2

[![CI](https://github.com/iendeavor/pinia-plugin-persistedstate-2/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/iendeavor/pinia-plugin-persistedstate-2/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/pinia-plugin-persistedstate-2.svg)](https://www.npmjs.com/package/pinia-plugin-persistedstate-2)

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Prettier](https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg)](https://github.com/prettier/prettier)

[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> This package works for Vue 2 & 3 by the power of [Vue Demi](https://github.com/vueuse/vue-demi)!

## Examples

[Vue 3](https://codesandbox.io/s/github/iendeavor/pinia-plugin-persistedstate-2/tree/main/examples/vue3-example?fontsize=14&hidenavigation=1&theme=dark&view=preview)

[Nuxt.js (client-only, with localStorage)](https://codesandbox.io/s/github/iendeavor/pinia-plugin-persistedstate-2/tree/main/examples/nuxtjs-client-example?fontsize=14&hidenavigation=1&theme=dark&view=preview)

[Nuxt3 (universal, with cookies)](https://codesandbox.io/s/github/iendeavor/pinia-plugin-persistedstate-2/tree/main/examples/nuxt3-universal-example?fontsize=14&hidenavigation=1&theme=dark&view=preview)

## Getting Started

### Installation

#### NPM

```shell
$ npm i pinia-plugin-persistedstate-2 # yarn add pinia-plugin-persistedstate-2
```

#### CDN

```html
<script src="https://unpkg.com/pinia-plugin-persistedstate-2"></script>
```

### Usage

```ts
import { ref } from 'vue' // import { ref } from '@vue/composition-api'
import { createPinia, defineStore } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

const pinia = createPinia()
pinia.use(
  createPersistedStatePlugin({
    // plugin options goes here
  }),
)

const useCounterStore = defineStore(
  'counter-store',
  () => {
    return {
      count: ref(0),
    }
  },
  {
    persistedState: {
      // store options goes here
    },
  },
)
// const counterStore = defineStore('counter-store', {
//   state() {
//     return { count: 0 }
//   },
//   persistedState: {
//     // store options goes here
//   },
// })

const counterStore = useCounterStore()
counterStore.count++ // fires window.localStorage.setItem('counter-store', JSON.stringify({ count: 0 }))
```

## SSR

### Nuxt.js

Follow [Pinia - Nuxt.js installation steps](https://pinia.esm.dev/ssr/nuxt.html#installation).

```js
// nuxt.config.js
export default {
  // ... other options
  buildModules: [
    // Nuxt 2 only:
    // https://composition-api.nuxtjs.org/getting-started/setup#quick-start
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ],
```

### With localStorage (client-only)

Create the plugin below to plugins config in your nuxt.config.js file.

```js
// nuxt.config.js
export default {
  // ... other options
  plugins: ['@/plugins/persistedstate.client.js'],
}
```

```ts
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

### With cookies (universal)

```js
// nuxt.config.js
export default {
  // ... other options
  plugins: ['@/plugins/persistedstate.universal.js'],
}
```

```ts
// plugins/persistedstate.universal.js
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import Cookies from 'js-cookie'
import cookie from 'cookie'

export default function ({ $pinia, ssrContext /* Nuxt 3 example */ }) {
  $pinia.use(
    createPersistedStatePlugin({
      // plugin options goes here
      storage: {
        getItem: (key) => {
          // See https://nuxtjs.org/guide/plugins/#using-process-flags
          if (process.server) {
            const parsedCookies = cookie.parse(ssrContext.req.headers.cookie)
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

## API

### Common Options

You could pass common options to `createPersistedStatePlugin(options)` and `defineStore('store', {}, { persistedState: options })`

- `storage?: Storage`: Defaults to `localStorage`. Where to store persisted state.

- `assertStorage?: (storage: Storage) => void | never`: Perform a Write-Delete operation by default. To ensure `storage` is available.

- `overwrite?: boolean`: Defaults to `false`. Whether to overwrite initial state when rehydrating. When this flat is true use `store.$state = persistedState`, `store.$patch(persistedState)` otherwise.

- `serialization?: (value: any): string`: Defaults to `JSON.stringify`.

- `deserialization?: (value: string): any`: Defaults to `JSON.parse`.

- `filter: (mutation, state): boolean`: A function that will be called to filter any mutations which will trigger setState on storage eventually.

### Plugin Options

> Extends [Common Options](#Common-Options).

### Store Options

> Extends [Common Options](#Common-Options).

- `key?: string`: Defaults to `store.$id`. The key to store the persisted state under.

- `includePath?: string[]`: An array of any paths to partially persist the state.

- `excludePath?: string[]`

## Contributing

Please read [CONTRIBUTING.md](/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull
requests to us.

## Versioning

This project use [SemVer](https://semver.org/) for versioning. For the versions available, see the tags on this repository.

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details
