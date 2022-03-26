<script>
import { toRefs } from '@vue/composition-api'
import { useCounterStore } from './stores/counter'

export default {
  setup() {
    const counterStore = useCounterStore()
    const { currentValue: count } = toRefs(counterStore)

    return { count }
  },
}
</script>

<template>
  <button type="button" @click="count++">count is: {{ count }}</button>
</template>
