import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { initErrorHandler } from '@/core/error'
import logger from '@/core/logger'

import './style.css'

const app = createApp(App)

// Initialize the error handler
initErrorHandler(app)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.mount('#app').$nextTick(() => {
  // Use contextBridge
  window.ipcRenderer.on('main-process-message', (_event, message) => {
    logger.info(message)
  })
})
