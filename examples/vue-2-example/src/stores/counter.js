import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter-store', {
  state: () => ({
    currentValue: 0,
  }),
})
