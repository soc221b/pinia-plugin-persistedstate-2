import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { createMachine } from 'xstate'
import { useMachine } from '@xstate/vue'

export const useWater = defineStore(
  'water-store',
  () => {
    const water = createWater('solid')
    const machine = ref(useMachine(water))
    const store = {
      machine,
      state: computed(() => machine.value.state.value),
      send: computed(() => machine.value.send),
    }

    return store
  },
  {
    persistedState: {
      beforeHydrate: (state) => {
        state.machine.service.stop()
      },
      serialize: (state) => {
        return JSON.stringify(state.machine.state.value)
      },
      deserialize: (value) => {
        const water = createWater(JSON.parse(value))
        const machine = useMachine(water)
        return {
          machine,
        }
      },
    },
  },
)

const createWater = (initial: 'solid' | 'liquid' | 'gas') =>
  createMachine({
    initial,
    states: {
      solid: {
        on: {
          melt: 'liquid',
        },
      },
      liquid: {
        on: {
          freeze: 'solid',
          vaporize: 'gas',
        },
      },
      gas: {
        on: {
          condense: 'liquid',
        },
      },
    },
  })
