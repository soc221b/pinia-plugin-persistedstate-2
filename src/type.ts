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
export interface CommonOptions {
  /**
   * Whether to persist store
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
   * When rehydrating, overwrite initial state (patch otherwise).
   *
   * @default false
   */
  overwrite?: boolean

  /**
   * This method will be called right before `storage.setItem`
   *
   * @default JSON.stringify
   */
  serialize?: (value: any) => any

  /**
   * This method will be called right after `storage.getItem`
   *
   * @default JSON.parse
   */
  deserialize?: (value: any) => any

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

  /**
   * The `migrate` function enables versioning store. This will be called after `deserialize` but before actually overwriting/patching the store.
   *
   * @default {value => value}
   */
  migrate?: (value: any) => any | Promise<any>
}

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S extends StateTree, Store> {
    persistedState?: StoreOptions
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
