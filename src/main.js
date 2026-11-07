import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createAppRouter } from './router/index.js'
import { initTheme } from './composables/useTheme.js'

initTheme()
createApp(App).use(createAppRouter()).mount('#app')
