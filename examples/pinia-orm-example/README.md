# Pinia ORM Example

## Installation

```sh
npm i pinia-plugin-persistedstate-2
```

## Usage

```diff
// src/stores/index.ts
import { Plugin } from 'vue'
import { createPinia } from 'pinia'
import { createORM } from 'pinia-orm'
+ import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

export const plugin: Plugin = (app) => {
  const pinia = createPinia()
  pinia.use(createORM())
+   pinia.use(createPersistedStatePlugin())

  app.use(pinia)
}
```
