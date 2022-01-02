import { StateTree, SubscriptionCallback } from 'pinia'

export interface IStorage {
  getItem: (key: string) => any | Promise<any>
  setItem: (key: string, value: any) => void | Promise<void>
  removeItem: (key: string) => void | Promise<void>
}

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
export interface CommonOptions<S extends StateTree = StateTree> {
  /**
   * Whether to persist store.
   * @default true
   */
  persist?: boolean

  /**
   * Where to store persisted state.
   *
   * @default localStorage
   */
  storage?: IStorage

  /**
   * To ensure storage is available.
   */
  assertStorage?: (storage: IStorage) => void | never

  /**
   * A function for merging state when rehydrating state.
   *
   * @default (state, savedState) => savedState
   */
  merge?: (state: S, savedState: S) => S

  /**
   * When rehydrating, overwrite initial state (patch otherwise).
   *
   * @default false
   */
  overwrite?: boolean

  /**
   * This method will be called right before `storage.setItem`.
   *
   * @default JSON.stringify
   */
  serialize?: (state: S) => any

  /**
   * This method will be called right after `storage.getItem`.
   *
   * @default JSON.parse
   */
  deserialize?: (value: any) => any

  /**
   * A function that will be called to filter any mutations which will trigger setState on storage eventually.
   *
   * @default () => true
   */
  filter?: (
    mutation: Parameters<SubscriptionCallback<S>>['0'],
    state: Parameters<SubscriptionCallback<S>>['1'],
  ) => boolean
}

export type PluginOptions<S> = CommonOptions<S>

export type StoreOptions<S> = CommonOptions<S> & {
  /**
   * The key to store the persisted state under.
   *
   * @default store.$id
   */
  key?: string

  /**
   * An array of any paths to partially persist the state.
   *
   * Use dot-notation `['foo', 'nested.bar']` for nested fields.
   *
   * @default undefined
   *
   */
  includePaths?: string[]

  /**
   * Opposite to `includePaths`, An array of any paths to exclude.
   *
   * Use dot-notation `['foo', 'nested.bar']` for nested fields.
   *
   * Warning: Due to deep copying, `excludePaths` may cause performance issues, if possible, please use `includePaths` instead.
   * @default undefined
   */
  excludePaths?: string[]

  /**
   * The `migrate` function enables versioning store. This will be called after `deserialize` but before actually overwriting/patching the store.
   *
   * @default {value => value}
   */
  migrate?: (value: any) => any | Promise<any>

  /**
   * This function gives you the opportunity to perform some tasks before actually overwriting/patching the store, such as cleaning up the old state.
   *
   * @default {value => value}
   */
  beforeHydrate?: (oldState: S) => void
}

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    persistedState?: StoreOptions<S>
  }

  export interface PiniaCustomProperties<
    Id extends string = string,
    S extends StateTree = StateTree,
    G /* extends GettersTree<S> */ = _GettersTree<S>,
    A /* extends ActionsTree */ = _ActionsTree,
  > {
    $persistedState: {
      /**
       * Whether store is hydrated
       */
      isReady: () => Promise<void>

      /**
       * Whether store is persisting
       */
      pending: boolean
    }
  }
}
