import { ref } from '@nuxtjs/composition-api'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter-store', () => {
  const currentValue = ref(0)

  return {
    currentValue,
  }
})
