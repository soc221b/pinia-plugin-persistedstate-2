import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'PiniaPluginPersistedstate_2',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['pinia'],
      output: {
        globals: {
          pinia: 'Pinia',
        },
      },
    },
  },
  plugins: [dts()],
})
