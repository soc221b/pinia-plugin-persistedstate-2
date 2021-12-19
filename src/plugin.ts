import {
  PiniaPlugin,
  PiniaPluginContext,
  StateTree,
  Store,
  SubscriptionCallbackMutation,
} from 'pinia'
import * as shvl from 'shvl'
import { CommonOptions, IStorage } from '.'
import { PluginOptions } from './type'
import { identity } from './util'

function getOption<K extends keyof CommonOptions<StateTree, Store>>(
  pluginOptions: CommonOptions<StateTree, Store>,
  options: CommonOptions<StateTree, Store>,
  key: K,
  fallback: CommonOptions<StateTree, Store>[K],
) {
  return (options[key] ?? pluginOptions[key] ?? fallback) as Required<
    CommonOptions<StateTree, Store>
  >[K]
}

export const createPersistedStatePlugin = <S extends StateTree, Store>(
  options?: PluginOptions<S, Store>,
): PiniaPlugin => {
  const defaultStorage: IStorage =
    typeof window === 'object'
      ? window.localStorage
      : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
  const defaultAssertStorage = (
    storage: Required<CommonOptions<S, Store>>['storage'],
  ) => {
    const uniqueKey = '@@'
    const result = storage.setItem(uniqueKey, '1')
    if (result instanceof Promise) {
      result.then(() => storage.removeItem(uniqueKey))
    } else {
      storage.removeItem(uniqueKey)
    }
  }

  const pluginOptions = options ?? ({} as PluginOptions<S, Store>)

  function plugin(context: PiniaPluginContext) {
    // initialize custom properties
    let resolveIsReady = () => {}
    const isReadyPromise = new Promise<void>((resolve) => {
      resolveIsReady = resolve
    })

    let pendingCount = 0
    context.store.$persistedState = {
      isReady: () => isReadyPromise,
      pending: false,
    }

    // normalize
    const options = context.options?.persistedState ?? {}
    if (getOption(pluginOptions, options, 'persist', true) === false) return

    const key = options.key ?? context.store.$id
    const overwrite = getOption(pluginOptions, options, 'overwrite', false)
    const storage = getOption(pluginOptions, options, 'storage', defaultStorage)
    const filter = getOption(pluginOptions, options, 'filter', () => true)
    const serialize = getOption(
      pluginOptions,
      options,
      'serialize',
      JSON.stringify,
    )
    const deserialize = getOption(
      pluginOptions,
      options,
      'deserialize',
      JSON.parse,
    )
    const migrate = options.migrate ?? identity

    if (__DEV__ || __TEST__) {
      ;(options.assertStorage ?? defaultAssertStorage)(storage)
    }

    // hydrate
    try {
      const patchOrOverwrite = (state: any) => {
        if (overwrite) {
          context.store.$state = state
        } else {
          context.store.$patch(state)
        }
        resolveIsReady()
      }

      const parse = (value: any) => {
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

      let value = storage.getItem(key)
      if (value instanceof Promise) {
        value.then(parse)
      } else {
        parse(value)
      }
    } catch (error) {
      if (__DEV__ || __TEST__) console.warn(error)
      resolveIsReady()
    }

    // persist
    context.store.$subscribe(
      (
        mutation: SubscriptionCallbackMutation<StateTree>,
        state: {
          [x: string]: any
          [x: number]: any
          [x: symbol]: any
        },
      ) => {
        if (filter(mutation, state) === false) return

        if (Array.isArray(options.includePaths)) {
          state = options.includePaths.reduce((partialState, path) => {
            return shvl.set(
              partialState,
              path,
              shvl.get(state as Record<string, unknown>, path),
            )
          }, {})
        }
        if (Array.isArray(options.excludePaths)) {
          state = deserialize(serialize(state))
          options.excludePaths.forEach((path) => {
            return shvl.set(state, path, undefined)
          }, {})
        }

        const value = serialize(state)
        const result = storage.setItem(key, value)
        if (result instanceof Promise) {
          ++pendingCount
          context.store.$persistedState.pending = pendingCount !== 0
          result
            .catch(() => {})
            .finally(() => {
              --pendingCount
              context.store.$persistedState.pending = pendingCount !== 0
            })
        }
      },
    )
  }

  return plugin
}
