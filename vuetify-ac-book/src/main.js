/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import { createRouter, createWebHistory } from 'vue-router';
import { createPinia } from 'pinia'

// Components
import App from './App.vue'
import AccountList from './components/AccountList.vue';
import BudgetList from './components/BudgetList.vue';
import BalanceList from './components/BalanceList.vue';

// Composables
import { createApp } from 'vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/accounts', component: AccountList }, // our-domain.com/teams => TeamsList
      { path: '/budget', component: BudgetList }, // our-domain.com/teams => TeamsList
      { path: '/balances/:accountId', component: BalanceList},
    ]
  });

const pinia = createPinia()

const app = createApp(App)

app.use(router);
app.use(pinia);
registerPlugins(app)

app.mount('#app')
