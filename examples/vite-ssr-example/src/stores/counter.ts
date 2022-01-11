import { ref } from 'vue'
import { defineStore } from 'pinia'
import { sleep } from '../utils'

export const useCounterStore = defineStore('counter-store', () => {
  const isInitialized = ref(false)

  const currentValue = ref(undefined as unknown as number)
  const fetchCount = async () => {
    await sleep(100)

    return 0
  }

  return {
    currentValue,
    isInitialized,
    fetchCount,
  }
})
