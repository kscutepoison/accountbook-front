/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import { createPinia } from 'pinia'
import router from './router';

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const pinia = createPinia()

const app = createApp(App)

app.use(router);
app.use(pinia);
registerPlugins(app)

app.mount('#app')
