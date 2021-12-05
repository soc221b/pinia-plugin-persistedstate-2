import { StateTree, SubscriptionCallback } from 'pinia'

/**
 * @description
 * PluginOptions and StoreOptions shares CommonOptions interface,
 *
 * @example
 *
 * You could pass most commonly used option to PluginOptions:
 *
 * `store1` will persist to and rehydrate from `localStorage`, and
 * `store2` will persist to and rehydrate from `sessionStorage`:
 *
 * ```
 * const plugin = createPersistedStatePlugin({ storage: localStorage })
 * const store1 = defineStore('store-1', () => {})
 * const store2 = defineStore('store-2', () => {}, { persistedState: { storage: sessionStorage } })
 * ```
 */
export interface CommonOptions {
  /**
   * Where to store persisted state.
   *
   * @default localStorage
   */
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

  /**
   * To ensure storage is available.
   */
  assertStorage?: (
    storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
  ) => void | never

  /**
   * When rehydrating, overwrite initial state (patch otherwise).
   *
   * @default false
   */
  overwrite?: boolean

  /**
   * This method will be called before `storage.setItem`
   *
   * @default JSON.stringify
   */
  serialization?: (value: any) => string

  /**
   * This method will be called after `storage.getItem`
   *
   * @default JSON.parse
   */
  deserialization?: (value: string) => any

  /**
   * A function that will be called to filter any mutations which will trigger setState on storage eventually.
   *
   * @default () => true
   */
  filter?: <S extends StateTree>(
    mutation: Parameters<SubscriptionCallback<S>>['0'],
    state: Parameters<SubscriptionCallback<S>>['1'],
  ) => boolean
}

export type PluginOptions = CommonOptions

export type StoreOptions = CommonOptions & {
  /**
   * The key to store the persisted state under.
   *
   * @default store.$id
   */
  key?: string

  /**
   * An array of any paths to partially persist the state
   *
   * Use dot-notation `['foo', 'nested.bar']` for nested fields.
   *
   * @default undefined
   *
   */
  includePaths?: string[]

  /**
   * @default undefined
   */
  excludePaths?: string[]
}

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    persistedState?: StoreOptions
  }
}
