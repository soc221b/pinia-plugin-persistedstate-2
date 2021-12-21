import * as shvl from 'shvl'

import type {
  PiniaPlugin,
  PiniaPluginContext,
  StateTree,
  SubscriptionCallback,
} from 'pinia'
import type { PluginOptions, CommonOptions } from './type'

function defaultTo<T>(a: T | null | undefined, b: T) {
  return a != null ? a : b
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

export function createPersistedStatePlugin<S extends StateTree, Store>(
  options?: PluginOptions<S, Store>,
): PiniaPlugin {
  const pluginOptions = options || ({} as PluginOptions<S, Store>)

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

    if (__DEV__ || __TEST__) {
      if (options.assertStorage === void 0) {
        options.assertStorage = function (
          storage: Required<CommonOptions<S, Store>>['storage'],
        ) {
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
        }
      }
      options.assertStorage(storage)
    }

    // hydrate
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

    function patchOrOverwrite(state: any) {
      ;(options.beforeHydrate || function () {})(context.store.$state)
      if (overwrite) {
        context.store.$state = state
      } else {
        context.store.$patch(state)
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

    try {
      const value = storage.getItem(key)
      if (value instanceof Promise) {
        value.then(parse)
      } else {
        parse(value)
      }
    } catch (error) {
      if (__DEV__ || __TEST__) console.warn(error)
      resolveIsReady!()
    }

    // persist
    const callback: SubscriptionCallback<S> = function (mutation, state) {
      if (filter(mutation, state) === false) return

      if (Array.isArray(options.includePaths)) {
        state = options.includePaths.reduce(function (partialState, path) {
          return shvl.set(
            partialState,
            path,
            shvl.get(state as Record<string, unknown>, path),
          )
        }, {} as any)
      }
      if (Array.isArray(options.excludePaths)) {
        state = deserialize(serialize(state))
        options.excludePaths.forEach(function (path) {
          return shvl.set(state, path, void 0)
        }, {})
      }

      const value = serialize(state)
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
    }
    context.store.$subscribe(callback)
  }

  return plugin
}
