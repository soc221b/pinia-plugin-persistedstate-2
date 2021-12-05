<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCounterStore } from './stores/counter'

const { currentValue: count } = storeToRefs(useCounterStore())
</script>

<template>
  <button type="button" @click="count++">count is: {{ count }}</button>
</template>
