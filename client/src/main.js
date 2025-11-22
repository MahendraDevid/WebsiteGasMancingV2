import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Setelah pinia dipasang, baru panggil store
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()
authStore.loadUserFromStorage()

app.use(router)
app.mount('#app')
