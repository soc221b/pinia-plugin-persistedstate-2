import viteSSR from 'vite-ssr'
import App from './App.vue'
import routes from './routes'
import installPinia from './pinia'

export default viteSSR(App, { routes }, (hookParams) => {
  installPinia(hookParams)
})
