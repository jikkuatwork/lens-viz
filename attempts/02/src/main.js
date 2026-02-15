import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import './app.css'

const app = createApp(App)
app.use(router)

router.isReady().then(() => app.mount('#app'))
