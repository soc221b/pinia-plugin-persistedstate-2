# Vue 3 example

## Installation

```sh
yarn add pinia
yarn add pinia-plugin-persistedstate-2
```

## Usage

```diff
// src/stores/index.ts

import { Plugin } from 'vue'
import { createPinia } from 'pinia'
+ import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

export const plugin: Plugin = (app) => {
  const pinia = createPinia()
+ pinia.use(createPersistedStatePlugin())

  app.use(pinia)
}
```
