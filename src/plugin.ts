import { PiniaPlugin, PiniaPluginContext } from 'pinia'
import * as shvl from 'shvl'
import { CommonOptions } from '.'
import { PluginOptions } from './type'

function getOption<K extends keyof CommonOptions>(
  pluginOptions: CommonOptions,
  options: CommonOptions,
  key: K,
  fallback: CommonOptions[K],
) {
  return (options[key] ??
    pluginOptions[key] ??
    fallback) as Required<CommonOptions>[K]
}

export const createPersistedStatePlugin = (
  options?: PluginOptions,
): PiniaPlugin => {
  const defaultStorage = window && window.localStorage
  const defaultAssertStorage = (
    storage: Required<CommonOptions>['storage'],
  ) => {
    const uniqueKey = '@@'
    storage.setItem(uniqueKey, '1')
    storage.removeItem(uniqueKey)
  }

  const pluginOptions = options ?? ({} as PluginOptions)
  if (__DEV__ || __TEST__) {
    ;(pluginOptions.assertStorage ?? defaultAssertStorage)(
      pluginOptions.storage ?? defaultStorage,
    )
  }

  function plugin(context: PiniaPluginContext) {
    // normalize
    const options = context.options?.persistedState ?? {}
    const key = options.key ?? context.store.$id
    const overwrite = getOption(pluginOptions, options, 'overwrite', false)
    const storage = getOption(pluginOptions, options, 'storage', defaultStorage)
    const filter = getOption(pluginOptions, options, 'filter', () => true)
    const serialization = getOption(
      pluginOptions,
      options,
      'serialization',
      JSON.stringify,
    )
    const deserialization = getOption(
      pluginOptions,
      options,
      'deserialization',
      JSON.parse,
    )

    if (__DEV__ || __TEST__) {
      ;(options.assertStorage ?? defaultAssertStorage)(storage)
    }

    // hydrate
    try {
      const value = storage.getItem(key)

      if (value !== null) {
        const state = deserialization(value)

        if (overwrite) {
          context.store.$state = state
        } else {
          context.store.$patch(state)
        }
      }
    } catch (error) {
      if (__DEV__ || __TEST__) console.warn(error)
    }

    // persist
    context.store.$subscribe((mutation, state) => {
      if (filter(mutation, state) === false) return

      if (Array.isArray(options.includePaths)) {
        state = options.includePaths.reduce((partialState, path) => {
          return shvl.set(
            partialState,
            path,
            shvl.get(state as Record<string, unknown>, path),
          )
        }, {})
      } else if (Array.isArray(options.excludePaths)) {
        state = deserialization(serialization(state))
        options.excludePaths.forEach((path) => {
          return shvl.set(state, path, undefined)
        }, {})
      }

      const value = serialization(state)
      storage.setItem(key, value)
    })
  }

  return plugin
}
