<template>
  <button
    type="button"
    @click="() => (counterStore.currentValue = counterStore.currentValue + 1)"
  >
    count is: {{ counterStore.currentValue }}
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCounterStore } from '../stores/counter'

export default defineComponent({
  setup() {
    const counterStore = useCounterStore()

    return {
      counterStore,
    }
  },
})
</script>
