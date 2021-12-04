import { createPinia, setActivePinia, defineStore } from 'pinia'

const pinia = createPinia()
setActivePinia(pinia)

defineStore('store', {
  persist: {},
})

defineStore('setup-store', () => {}, {
  persist: {},
})

it('', () => {})
