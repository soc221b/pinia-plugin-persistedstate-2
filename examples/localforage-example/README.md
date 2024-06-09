# Localforage example

## Installation

## Installation

```sh
npm i localforage
npm i pinia-plugin-persistedstate-2
```

## Usage

```diff
// src/stores/index.ts
import { Plugin } from 'vue'
import { createPinia } from 'pinia'
+ import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
+ import localforage from 'localforage'

export const plugin: Plugin = (app) => {
  const pinia = createPinia()

+ pinia.use(
+   createPersistedStatePlugin({
+     storage: {
+       getItem: async (key) => {
+         return localforage.getItem(key)
+       },
+       setItem: async (key, value) => {
+         return localforage.setItem(key, value)
+       },
+       removeItem: async (key) => {
+         return localforage.removeItem(key)
+       },
+     },
+   }),
+ )

  app.use(pinia)
}
```
