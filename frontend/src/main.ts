// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importar estilos globales
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@/assets/estilos/global.css'

const app = createApp(App)

app.use(router)

app.mount('#app')
