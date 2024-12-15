import * as shvl from 'shvl'

import type { PiniaPlugin, PiniaPluginContext, StateTree } from 'pinia'
import type { PluginOptions, CommonOptions } from './type'

function defaultTo<T>(a: T | null | undefined, b: T) {
  if (a === undefined) return b
  else if (a === null) return b
  else return a
}

function getOption<T, K extends keyof T>(
  fallback: T[K],
  key: K,
  options1: T,
  options2: T,
) {
  return defaultTo(
    defaultTo(options1[key], options2[key]),
    fallback,
  ) as Required<T>[K]
}

export function createPersistedStatePlugin<S extends StateTree = StateTree>(
  options?: PluginOptions<S>,
): PiniaPlugin {
  const pluginOptions = options || ({} as PluginOptions<StateTree>)

  function plugin(context: PiniaPluginContext) {
    // normalize
    const options = (function () {
      try {
        return context.options.persistedState || {}
      } catch {
        return {}
      }
    })()
    if (getOption(true, 'persist', options, pluginOptions) === false) return

    const key = getOption(context.store.$id, 'key', options, {})
    const overwrite = getOption(false, 'overwrite', options, pluginOptions)
    const storage = getOption(
      (function () {
        try {
          return window.localStorage
        } catch {
          return {
            getItem: function () {},
            setItem: function () {},
            removeItem: function () {},
          }
        }
      })(),
      'storage',
      options,
      pluginOptions,
    )
    const filter = getOption(
      function () {
        return true
      },
      'filter',
      options,
      pluginOptions,
    )
    const serialize = getOption(
      JSON.stringify,
      'serialize',
      options,
      pluginOptions,
    )
    const deserialize = getOption(
      JSON.parse,
      'deserialize',
      options,
      pluginOptions,
    )
    const migrate = getOption(
      function <T>(_: T) {
        return _
      },
      'migrate',
      options,
      {},
    )
    const merge = getOption(
      function (_, savedState) {
        return savedState
      },
      'merge',
      options,
      {},
    )
    const assertStorage = getOption(
      function (storage: Required<CommonOptions<S>>['storage']) {
        const uniqueKey = '@@'
        const result = storage.setItem(uniqueKey, '1')
        const removeItem = function () {
          storage.removeItem(uniqueKey)
        }
        if (result instanceof Promise) {
          result.then(removeItem)
        } else {
          removeItem()
        }
      },
      'assertStorage',
      options,
      pluginOptions,
    )

    function patchOrOverwrite(state: any) {
      ;(options.beforeHydrate || function () {})(context.store.$state)
      const merged = merge(context.store.$state, state)
      if (overwrite) {
        context.store.$patch((state) => {
          Object.keys(state).forEach((key) => {
            state[key] = merged[key]
          })
        })
      } else {
        context.store.$patch(merged)
      }
      resolveIsReady()
    }

    function parse(value: any) {
      if (value != null) {
        const state = deserialize(value)
        const migrateState = migrate(state)

        if (migrateState instanceof Promise) {
          migrateState.then(patchOrOverwrite)
        } else {
          patchOrOverwrite(migrateState)
        }
      } else {
        resolveIsReady()
      }
    }

    // initialize custom properties
    let resolveIsReady: Function
    const isReadyPromise = new Promise<void>(function (resolve) {
      resolveIsReady = resolve
    })
    let pendingCount = 0
    context.store.$persistedState = {
      isReady: function () {
        return isReadyPromise
      },
      pending: false,
    }

    // hydrate
    try {
      if (process.env.NODE_ENV !== 'production') {
        const assertStorageValue = assertStorage(storage)
        if (assertStorageValue instanceof Promise) {
          assertStorageValue
            .then(() => hydrate())
            .catch((error) => console.warn(error))
        } else {
          hydrate()
        }
      } else {
        hydrate()
      }
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') console.warn(error)
      resolveIsReady!()
    }
    function hydrate() {
      const value = storage.getItem(key)
      if (value instanceof Promise) {
        value.then(parse)
      } else {
        parse(value)
      }
    }

    // persist
    context.store.$subscribe(function (mutation, state) {
      if (filter(mutation, state as any) === false) return

      if (Array.isArray(options.includePaths)) {
        state = options.includePaths.reduce(function (partialState, path) {
          return shvl.set(
            partialState,
            path,
            shvl.get(state as Record<string, unknown>, path, void 0),
            void 0,
          )
        }, {} as any)
      }
      if (Array.isArray(options.excludePaths)) {
        state = deserialize(serialize(state as any))
        options.excludePaths.forEach(function (path) {
          return shvl.set(state, path, void 0, void 0)
        }, {})
      }

      const value = serialize(state as any)
      const result = storage.setItem(key, value)
      if (result instanceof Promise) {
        ++pendingCount
        context.store.$persistedState.pending = pendingCount !== 0
        result
          .catch(function () {})
          .finally(function () {
            --pendingCount
            context.store.$persistedState.pending = pendingCount !== 0
          })
      }
    })
  }

  return plugin
}
