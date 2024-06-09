<template>
  <button type="button" @click="counterStore.increment">
    count is: {{ count }}
  </button>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCounter } from '../../stores/useCounter'

const counterStore = useCounter()
const { count } = storeToRefs(counterStore)
</script>
