import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './styles/main.css'
import App from './App.vue'

// Initialize theme before Vue app mounts
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme')
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

  const root = document.documentElement
  root.classList.remove('light', 'dark')

  if (savedTheme === 'dark' || savedTheme === 'light') {
    root.classList.add(savedTheme)
  } else {
    root.classList.add(systemTheme)
  }
}

// Initialize theme immediately
initializeTheme()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')