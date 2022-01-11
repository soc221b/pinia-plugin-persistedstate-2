<script lang="ts">
import { defineComponent } from 'vue'
import { useCounterStore } from '../stores/counter'
import { useContext } from 'vite-ssr/vue'

export default defineComponent({
  async setup() {
    const { initialState } = useContext()

    const counterStore = useCounterStore()
    if (counterStore.isInitialized === false) {
      const count = await counterStore.fetchCount()
      if (import.meta.env.SSR) {
        initialState.count = count
      }
      counterStore.currentValue = initialState.count
      counterStore.isInitialized = true
    }

    return {
      counterStore,
    }
  },
})
</script>

<template>
  <button type="button" @click="counterStore.currentValue++">
    count is: {{ counterStore.currentValue }}
  </button>
</template>
