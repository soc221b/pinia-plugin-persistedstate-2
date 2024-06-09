# Vue 3 example

## Installation

```sh
npm i pinia-plugin-persistedstate-2
```

## Usage

```diff
// src/stores/index.ts

import { Plugin } from 'vue'
import { createPinia } from 'pinia'
+ import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

export const plugin: Plugin = (app) => {
  const pinia = createPinia()

+ const installPersistedStatePlugin = createPersistedStatePlugin()
+ pinia.use((context) => installPersistedStatePlugin(context))

  app.use(pinia)
}
```
