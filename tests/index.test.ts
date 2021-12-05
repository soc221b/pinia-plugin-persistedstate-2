import { ref, nextTick } from 'vue-demi'
import { createPinia, defineStore, Pinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createPersistedStatePlugin } from '../src'

const getItem = jest.fn()
const setItem = jest.fn()
const removeItem = jest.fn()
const storage = {
  getItem,
  setItem,
  removeItem,
}

let pinia: Pinia
beforeEach(() => {
  getItem.mockImplementation(() => null)

  pinia = createPinia().use(
    createPersistedStatePlugin({
      storage,
    }),
  )
  mount({ template: 'none' }, { global: { plugins: [pinia] } })
})

afterEach(() => {
  getItem.mockClear()
  setItem.mockClear()
  removeItem.mockClear()
})

const useCounterStore = defineStore('counter-store', () => {
  return {
    count: ref(0),
  }
})

it('can be created with default options', () => {
  expect(() => createPinia().use(createPersistedStatePlugin())).not.toThrow()
})

it('assert storage when initializing', () => {
  const assertStorage = jest.fn()
  const useStore = defineStore(
    'store',
    () => {
      return {
        foo: ref(0),
      }
    },
    { persistedState: { assertStorage } },
  )

  useStore()

  expect(assertStorage).toBeCalled()

  assertStorage.mockClear()
})

describe('hydrate', () => {
  it("does not replaces store's state when initializing", () => {
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const counterStore = useCounterStore()

    expect(storage.getItem).toBeCalled()
    expect(spyWarn).not.toBeCalled()
    expect(counterStore.count).toBe(0)

    spyWarn.mockRestore()
  })

  it("does not replaces store's state when persisted state is an invalid JSON", () => {
    const spyGetItem = jest
      .spyOn(storage, 'getItem')
      .mockImplementation(() => 'invalid')
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const counterStore = useCounterStore()

    expect(spyGetItem).toBeCalled()
    expect(spyWarn).toBeCalled()
    expect(counterStore.count).toBe(0)

    spyGetItem.mockRestore()
    spyWarn.mockRestore()
  })

  it("replaces store's state when persisted state is an valid JSON", () => {
    const spyGetItem = jest
      .spyOn(storage, 'getItem')
      .mockImplementation(() => JSON.stringify({ count: 1 }))
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const counterStore = useCounterStore()

    expect(spyGetItem).toBeCalled()
    expect(spyWarn).not.toBeCalled()
    expect(counterStore.count).toBe(1)

    spyGetItem.mockRestore()
    spyWarn.mockRestore()
  })

  it('applies deserialization when hydrating', () => {
    const spyGetItem = jest
      .spyOn(storage, 'getItem')
      .mockImplementation(() => JSON.stringify({ count: 1 }))
    const spyDeserialization = jest.fn().mockImplementation(() => ({
      count: 2,
    }))
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const counterStore = defineStore(
      'store',
      () => {
        return {
          count: ref(0),
        }
      },
      { persistedState: { deserialization: spyDeserialization } },
    )()

    expect(spyGetItem).toBeCalled()
    expect(spyDeserialization).toBeCalled()
    expect(counterStore.count).toBe(2)
    expect(spyWarn).not.toBeCalled()

    spyGetItem.mockRestore()
    spyDeserialization.mockRestore()
    spyWarn.mockRestore()
  })

  it('patch state by default', () => {
    const spyGetItem = jest
      .spyOn(storage, 'getItem')
      .mockImplementation(() => JSON.stringify({ nested: { bar: 1 } }))
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const store = defineStore('store', () => {
      return {
        nested: ref({
          foo: 0,
          bar: 0,
        }),
      }
    })()

    expect(spyGetItem).toBeCalled()
    expect(store.nested.foo).toBe(0)
    expect(store.nested.bar).toBe(1)
    expect(spyWarn).not.toBeCalled()

    spyGetItem.mockRestore()
    spyWarn.mockRestore()
  })

  it('replace whole state when overwrite flag is enabled', () => {
    const spyGetItem = jest
      .spyOn(storage, 'getItem')
      .mockImplementation(() => JSON.stringify({ nested: { bar: 1 } }))
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const store = defineStore(
      'store',
      () => {
        return {
          nested: ref({
            foo: 0,
            bar: 0,
          }),
        }
      },
      { persistedState: { overwrite: true } },
    )()

    expect(spyGetItem).toBeCalled()
    expect(store.nested.foo).toBe(undefined)
    expect(store.nested.bar).toBe(1)
    expect(spyWarn).not.toBeCalled()

    spyGetItem.mockRestore()
    spyWarn.mockRestore()
  })
})

describe('persist', () => {
  it('persist full state by default', async () => {
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const counterStore = useCounterStore()

    counterStore.count = 1
    await nextTick()

    expect(setItem).lastCalledWith(
      'counter-store',
      JSON.stringify({ count: 1 }),
    )
    expect(spyWarn).not.toBeCalled()

    spyWarn.mockRestore()
  })

  it('persist partial state when given includePaths', async () => {
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const store = defineStore(
      'store',
      () => {
        return {
          foo: ref(0),
          bar: ref(0),
          nested: ref({
            baz: 0,
            qux: 0,
          }),
        }
      },
      { persistedState: { includePaths: ['foo', 'nested.baz'] } },
    )()

    store.$state = {
      foo: 1,
      bar: 1,
      nested: {
        baz: 1,
        qux: 1,
      },
    }
    await nextTick()

    expect(setItem).lastCalledWith(
      'store',
      JSON.stringify({ foo: 1, nested: { baz: 1 } }),
    )
    expect(spyWarn).not.toBeCalled()

    spyWarn.mockRestore()
  })

  it('persist partial state when given excludePaths', async () => {
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const store = defineStore(
      'store',
      () => {
        return {
          foo: ref(0),
          bar: ref(0),
          nested: ref({
            baz: 0,
            qux: 0,
          }),
        }
      },
      { persistedState: { excludePaths: ['bar', 'nested.qux'] } },
    )()

    store.$state = {
      foo: 1,
      bar: 1,
      nested: {
        baz: 1,
        qux: 1,
      },
    }
    await nextTick()

    expect(setItem).lastCalledWith(
      'store',
      JSON.stringify({ foo: 1, nested: { baz: 1 } }),
    )
    expect(spyWarn).not.toBeCalled()

    spyWarn.mockRestore()
  })

  it('not persist state when given includePaths is empty', async () => {
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const store = defineStore(
      'store',
      () => {
        return {
          foo: ref(0),
          bar: ref(0),
          nested: ref({
            baz: 0,
            qux: 0,
          }),
        }
      },
      { persistedState: { includePaths: [] } },
    )()

    store.$state = {
      foo: 1,
      bar: 1,
      nested: {
        baz: 1,
        qux: 1,
      },
    }
    await nextTick()

    expect(setItem).lastCalledWith('store', JSON.stringify({}))
    expect(spyWarn).not.toBeCalled()

    spyWarn.mockRestore()
  })

  it('persist full state when given excludePaths is empty', async () => {
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const store = defineStore(
      'store',
      () => {
        return {
          foo: ref(0),
          bar: ref(0),
          nested: ref({
            baz: 0,
            qux: 0,
          }),
        }
      },
      { persistedState: { excludePaths: [] } },
    )()

    store.$state = {
      foo: 1,
      bar: 1,
      nested: {
        baz: 1,
        qux: 1,
      },
    }
    await nextTick()

    expect(setItem).lastCalledWith(
      'store',
      JSON.stringify({
        foo: 1,
        bar: 1,
        nested: {
          baz: 1,
          qux: 1,
        },
      }),
    )
    expect(spyWarn).not.toBeCalled()

    spyWarn.mockRestore()
  })

  it.skip('should not persist null values', async () => {
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const store = defineStore(
      'store',
      () => {
        return {
          foo: ref<number | null>(0),
          nested: {
            bar: ref<number | null>(0),
          },
        }
      },
      { persistedState: { excludePaths: [] } },
    )()

    store.$state = {
      foo: null,
      nested: {
        bar: null,
      },
    }
    await nextTick()

    expect(setItem).lastCalledWith('store', JSON.stringify({}))
    expect(spyWarn).not.toBeCalled()

    spyWarn.mockRestore()
  })

  it('applies serialization when persisting', async () => {
    const spySerialization = jest.fn().mockImplementation(() =>
      JSON.stringify({
        count: 2,
      }),
    )
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const counterStore = defineStore(
      'store',
      () => {
        return {
          count: ref(0),
        }
      },
      { persistedState: { serialization: spySerialization } },
    )()
    setItem.mockClear()

    counterStore.count = 1
    await nextTick()

    expect(spySerialization).toBeCalledWith({ count: 1 })
    expect(setItem).toHaveBeenLastCalledWith(
      'store',
      JSON.stringify({ count: 2 }),
    )
    expect(spyWarn).not.toBeCalled()

    spySerialization.mockRestore()
    spyWarn.mockRestore()
  })

  it('filters to specific mutation types', async () => {
    const spyWarn = jest.spyOn(console, 'warn').mockImplementation()

    const store = defineStore(
      'store',
      () => {
        return {
          count: ref(0),
        }
      },
      {
        persistedState: {
          filter: (mutation) => {
            return mutation.type !== 'direct'
          },
        },
      },
    )()
    setItem.mockClear()

    store.count = 1
    await nextTick()

    expect(setItem).not.toBeCalled()
    expect(spyWarn).not.toBeCalled()

    store.$patch({ count: 2 })
    await nextTick()

    expect(setItem).toBeCalledWith('store', JSON.stringify({ count: 2 }))
    expect(spyWarn).not.toBeCalled()

    spyWarn.mockRestore()
  })

  it('persist with given key', async () => {
    const customKey = 'custom'
    const store = defineStore(
      'store',
      () => {
        return {
          foo: ref(0),
        }
      },
      { persistedState: { key: customKey } },
    )()

    store.$state = {
      foo: 1,
    }
    await nextTick()

    expect(setItem).lastCalledWith(customKey, JSON.stringify({ foo: 1 }))
  })
})
