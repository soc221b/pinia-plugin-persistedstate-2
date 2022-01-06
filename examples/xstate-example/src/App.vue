<script setup lang="ts">
import { useWater } from './stores/water'

const fsm = useWater()
</script>

<template>
  <div>count is: {{ fsm.state }}</div>
  <button @click="fsm.send('vaporize')">Vaporize</button>
  <button @click="fsm.send('condense')">Condense</button>
  <button @click="fsm.send('melt')">Melt</button>
  <button @click="fsm.send('freeze')">Freeze</button>
</template>
