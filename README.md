# pinia-plugin-persistedstate-2

Persist and rehydrate your Pinia state between page reloads.

This project use [SemVer](https://semver.org/) for versioning. For the versions available, see the tags on this repository.

[![CI](https://github.com/iendeavor/pinia-plugin-persistedstate-2/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/iendeavor/pinia-plugin-persistedstate-2/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/pinia-plugin-persistedstate-2.svg)](https://www.npmjs.com/package/pinia-plugin-persistedstate-2)
[![Bundle size](https://badgen.net/bundlephobia/minzip/pinia-plugin-persistedstate-2)](https://bundlephobia.com/result?p=pinia-plugin-persistedstate-2)

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Prettier](https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg)](https://github.com/prettier/prettier)

[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

[![donate](https://img.shields.io/badge/sponsor-buy%20me%20a%20coffee-orange)](https://www.buymeacoffee.com/iendeavor)
[![donate](https://img.shields.io/badge/sponsor-paypal-orange)](https://www.paypal.com/paypalme/iendeavor/5)

## ✨ Features

- 🎨 Configurable globally and in every store.
- 💪 Type Safe
- 📦 Extremely small

## 🚀 Getting Started

### Installation

#### Package Manager

```sh
# npm
npm i pinia-plugin-persistedstate-2

# yarn
yarn add pinia-plugin-persistedstate-2

# pnpm
pnpm add pinia-plugin-persistedstate-2
```

#### CDN

```html
<script src="https://unpkg.com/pinia-plugin-persistedstate-2"></script>
```

You can find the library on `window.PiniaPluginPersistedstate_2`.

### Usage

All you need to do is add the plugin to pinia:

```ts
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

const pinia = createPinia()
const installPersistedStatePlugin = createPersistedStatePlugin()
pinia.use((context) => installPersistedStatePlugin(context))
```

#### Storage

The default storage is `localStorage`, but you can also use other storage, e.g., using [localForage](https://www.npmjs.com/package/localforage):

```ts
// ...
import localforage from 'localforage'

// ...
pinia.use(
  createPersistedStatePlugin({
    storage: {
      getItem: async (key) => {
        return localforage.getItem(key)
      },
      setItem: async (key, value) => {
        return localforage.setItem(key, value)
      },
      removeItem: async (key) => {
        return localforage.removeItem(key)
      },
    },
  }),
)
```

#### Serialization and Deserialization

Serialization and deserialization allow you to customize the state that gets persisted and rehydrated.

For example, if your state has circular references, you may need to use [json-stringify-safe](https://www.npmjs.com/package/json-stringify-safe) to prevent circular references from being thrown:

```ts
// ...
import stringify from 'json-stringify-safe'

// ...
pinia.use(
  createPersistedStatePlugin({
    serialize: (value) => stringify(value),
  }),
)
```

#### Migrations

During updates, we may change structure of stores due to refactoring or other reasons.

To support this feature, this plugin provides the `migrate` function, which will be called after `deserialize` but before actually overwriting/patching the store:

```ts
// ...
const store = defineStore(
  'store',
  () => {
    return {
      // oldKey: ref(0),
      newKey: ref(0),
    }
  },
  {
    persistedState: {
      overwrite: true,
      migrate: (state) => {
        if (typeof state.oldKey === 'number') {
          return {
            newKey: state.oldKey,
          }
        }

        return state
      },
    },
  },
)()
```

#### SSR

##### Nuxt.js

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
}
```

##### With localStorage (client-only) (nuxt@2 example)

Create the plugin below to plugins config in your nuxt.config.js file.

```js
// nuxt.config.js
export default {
  // ... other options
  plugins: ['@/plugins/persistedstate.js'],
}
```

```ts
// plugins/persistedstate.js
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

export default function ({ $pinia }) {
  if (process.client) {
    $pinia.use(createPersistedStatePlugin())
  }
}
```

##### With cookies (universal) (nuxt@3 example)

```ts
// plugins/persistedstate.js
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import Cookies from 'js-cookie'
import cookie from 'cookie'

export default function ({ $pinia, ssrContext }) {
  $pinia.use(
    createPersistedStatePlugin({
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

## 📖 API

For more details, see [type.ts](./src/type.ts).

### Common Options

- `persist?: boolean`: Defaults to `true`. Whether to persist store.

- `storage?: IStorage`: Defaults to `localStorage`. Where to store persisted state.

- `assertStorage?: (storage: IStorage) => void | never`: Perform a Write-Delete operation by default. To ensure `storage` is available.

- `overwrite?: boolean`: Defaults to `false`. Whether to overwrite initial state when rehydrating. When this flat is true use `store.$state = persistedState`, `store.$patch(persistedState)` otherwise.

- `merge?: (state: S, savedState: S) => S`: Defaults to `(state, savedState) => savedState`. A function for merging state when rehydrating state.

- `serialize?: (state: S): any`: Defaults to `JSON.stringify`. This method will be called right before `storage.setItem`.

- `deserialize?: (value: any): any`: Defaults to `JSON.parse`. This method will be called right after `storage.getItem`.

- `filter: (mutation, state): boolean`: A function that will be called to filter any mutations which will trigger setState on storage eventually.

#### IStorage

- `getItem: (key: string) => any | Promise<any>`: Any value other than `undefined` or `null` will be rehydrated.

- `setItem: (key: string, value: any) => void | Promise<void>`

- `removeItem: (key: string) => void | Promise<void>`

### Plugin Options

> Supports all [common options](#Common-Options). These options are the default values for each store, you can set the most commonly used options in the _plugin options_, and override/extend it in the _store options_.

```ts
createPersistedStatePlugin({
  // plugin options goes here
})
```

### Store Options

> Supports all [common options](#Common-Options).

```ts
defineStore(
  'counter-store',
  () => {
    const currentValue = ref(0)
    const increment = () => currentValue.value++

    return {
      currentValue,
      increment,
    }
  },
  {
    persistedState: {
      // store options goes here
    },
  },
)
```

- `key?: string`: Defaults to `store.$id`. The key to store the persisted state under.

- `includePaths?: (string | string[])[]`: An array of any paths to partially persist the state. Use dot-notation `['key', 'nested.key', ['special.key']]` for nested fields.

- `excludePaths?: (string | string[])[]`: Opposite to `includePaths`, An array of any paths to exclude. Due to deep copying, `excludePaths` may cause performance issues, if possible, please use `includePaths` instead.

- `migrate?: (value: any) => any | Promise<any>`: The `migrate` function enables versioning store. This will be called after `deserialize` but before actually overwriting/patching the store.

- `beforeHydrate?: (oldState: S) => void`: This function gives you the opportunity to perform some tasks before actually overwriting/patching the store, such as cleaning up the old state.

### Store Properties

- `store.$persistedState.isReady: () => Promise<void>`: Whether store is hydrated

- `store.$persistedState.pending: boolean`: Whether store is persisting

## 🤝 Contributing

Please read [CONTRIBUTING.md](/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull
requests to us.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details
