<script setup lang="ts">
import { useCounterStore } from './stores/counter'

const counterStore = useCounterStore()
</script>

<template>
  <button type="button" @click="counterStore.currentValue++">
    count is: {{ counterStore.currentValue }}
  </button>
</template>
