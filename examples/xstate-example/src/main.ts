import { createApp } from 'vue'
import App from './App.vue'
import { plugin as storePlugin } from './stores'

createApp(App).use(storePlugin).mount('#app')
