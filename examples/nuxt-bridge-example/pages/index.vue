<template>
  <button @click="() => counterStore.currentValue++">
    Count is: {{ counterStore.currentValue }}
  </button>
</template>

<script>
import { useCounterStore } from '@/stores/counter'

export default defineComponent({
  setup() {
    const counterStore = useCounterStore()

    return {
      counterStore,
    }
  },
})
</script>
