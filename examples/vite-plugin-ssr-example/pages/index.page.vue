<template>
  <h1>Pinia Example</h1>
  <span>Counter that keeps its state on navigation</span>:
  <button type="button" @click="counterStore.increment">
    Counter {{ count }}
  </button>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useCounter } from '../stores/useCounter'

const counterStore = useCounter()
const { count } = storeToRefs(counterStore)
</script>
