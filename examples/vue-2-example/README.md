# Vue 2 example

## Installation

```sh
npm i pinia-plugin-persistedstate-2
```

## Usage

```diff
// src/main.js

import Vue from 'vue'
import App from './App.vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
+ import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

Vue.config.productionTip = false

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
+ const installPersistedStatePlugin = createPersistedStatePlugin()
+ pinia.use((context) => installPersistedStatePlugin(context))

new Vue({
  render: (h) => h(App),
  pinia,
}).$mount('#app')
```
