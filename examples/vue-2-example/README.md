# Vue 2 example

## Installation

```sh
yarn add pinia-plugin-persistedstate-2
```

## Usage

```diff
// src/main.js

import Vue from 'vue'
import App from './App.vue'
import VueCompositionAPI from '@vue/composition-api'
import { createPinia, PiniaVuePlugin } from 'pinia'
+ import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'

Vue.config.productionTip = false

Vue.use(VueCompositionAPI)

Vue.use(PiniaVuePlugin)
const pinia = createPinia()
+ const installPersistedStatePlugin = createPersistedStatePlugin()
+ pinia.use((context) => installPersistedStatePlugin(context))

new Vue({
  render: (h) => h(App),
  pinia,
}).$mount('#app')
```
