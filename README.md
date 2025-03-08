# pinia-plugin-persistedstate-2

Persist and rehydrate your Pinia state between page reloads.

[![CI](https://github.com/soc221b/pinia-plugin-persistedstate-2/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/soc221b/pinia-plugin-persistedstate-2/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/pinia-plugin-persistedstate-2.svg)](https://www.npmjs.com/package/pinia-plugin-persistedstate-2)

Features

- 🎨 Configurable globally and in every store.
- 💪 Type Safe
- 📦 Extremely small

## 🚀 Getting Started

### Installation

```sh
# or pnpm or yarn
npm install pinia-plugin-persistedstate-2
```

### Usage

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedStatePlugin } from 'pinia-plugin-persistedstate-2'
import App from './App.vue'

const pinia = createPinia()

const persistedStatePlugin = createPersistedStatePlugin({
  // plugin options goes here
})
pinia.use(persistedStatePlugin)

const app = createApp(App)
app.use(pinia)
app.mount('#app')
```

More examples can be found in the [examples](./examples) folder.

API can be found in the [type](./src/type.ts) file.

## 🤝 Contributing

Please read [CONTRIBUTING.md](/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull
requests to us.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details
