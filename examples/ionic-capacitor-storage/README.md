# Vue 3 Ionic Capacitor Storage example

![](./asset.gif)

## Installation

```sh
pnpm add pinia pinia-plugin-persistedstate-2 @capacitor/core @capacitor/storage
pnpm add @capacitor/cli -D
```

## Build and open iOS simulator

```sh
pnpm build && npx cap sync && npx cap open ios
```

## How it worked

set plugin custom `storage` option :

```ts
createPersistedStatePlugin({
  storage: {
    getItem: (key) => Storage.get({ key }).then(({ value }) => value),
    removeItem: (key) => Storage.remove({ key }),
    setItem: (key, value) => Storage.set({ key, value }),
  },
})
```

is need prefix

```ts
const p = (_) => 'you_prefix-' + _

createPersistedStatePlugin({
  storage: {
    getItem: (key) => Storage.get({ key: p(key) }).then(({ value }) => value),
    removeItem: (key) => Storage.remove({ key: p(key) }),
    setItem: (key, value) => Storage.set({ key: p(key), value }),
  },
})
```
