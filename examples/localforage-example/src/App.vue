<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCounterStore } from './stores/counter'

const counterStore = useCounterStore()

const hydrating = ref(true)
counterStore.$persistedState.isReady().then(() => {
  hydrating.value = false
})

const pending = computed(() => counterStore.$persistedState.pending)
</script>

<template>
  <div v-if="hydrating">Hydrating ...</div>

  <div v-else>
    <button
      type="button"
      @click="() => (counterStore.currentValue = counterStore.currentValue + 1)"
    >
      count is: {{ counterStore.currentValue }}
    </button>

    <div v-if="pending">Pending ...</div>
  </div>
</template>
