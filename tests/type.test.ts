import { createPinia, setActivePinia, defineStore } from 'pinia'

const pinia = createPinia()
setActivePinia(pinia)

defineStore('store', {
  persistedState: {},
})

defineStore('setup-store', () => {}, {
  persistedState: {},
})

it('', () => {})
