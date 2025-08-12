import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useTheme } from './composables/useTheme'

const app = createApp(App)

app.use(createPinia())

// Initialize theme before mounting
const { initTheme } = useTheme()
initTheme()

app.mount('#app')
