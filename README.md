# pinia-plugin-persistedstate-2

[![CI](https://github.com/iendeavor/pinia-plugin-persistedstate-2/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/iendeavor/pinia-plugin-persistedstate-2/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/pinia-plugin-persistedstate-2.svg)](https://www.npmjs.com/package/pinia-plugin-persistedstate-2)

<br/>

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![Prettier](https://img.shields.io/badge/Code_Style-Prettier-ff69b4.svg)](https://github.com/prettier/prettier)

<br/>

[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> This package works for Vue 2 & 3 by the power of [Vue Demi](https://github.com/vueuse/vue-demi)!

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
import { createPersistPlugin } from 'pinia-plugin-persistedstate-2'

const pinia = createPinia()
pinia.use(createPersistPlugin())

const useCounterStore = defineStore(
  'counter-store',
  () => {
    return {
      count: ref(0),
    }
  },
  { persist: { storage: window.localStorage } },
)
// const counterStore = defineStore('counter-store', {
//   state() {
//     return { count: 0 }
//   },
//   persist: { storage: window.localStorage },
// })

const counterStore = useCounterStore()
counterStore.count++ // fires window.localStorage.setItem('counter-store', JSON.stringify({ count: 0 }))
```

## API

### Common Options

You could pass common options to `createPersistPlugin(options)` and `defineStore('store', {}, { persist: options })`

- `storage?: Storage`: Defaults to `localStorage`. Where to store persisted state.

- `assertStorage?: (storage: Storage) => void | never`: Perform a Write-Delete operation by default. To ensure `storage` is available.

- `overwrite?: boolean`: Defaults to `false`. Whether to overwrite initial state when rehydrating. When this flat is true use `store.$state = persistedState`, `store.$patch(persistedState)` otherwise.

- `serialization?: (value: any): string`: Defaults to `JSON.stringify`.

- `deserialization?: (value: string): any`: Defaults to `JSON.parse`.

- `filter: (mutation, state): boolean`: A function that will be called to filter any mutations which will trigger setState on storage eventually.

### Store Options

> Support all of common options.

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
