import { createRouter, createWebHistory } from 'vue-router';

import AccountList from './components/AccountList.vue';
import CategoryList from './components/CategoryList.vue';
import BudgetList from './components/BudgetList.vue';
import BalanceList from './components/BalanceList.vue';
import UserAuth from './components/UserAuth.vue';
import Tabs from './components/Tabs.vue';

import { useAuthStore } from './stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/auth' },
    { path: '/accounts', component: AccountList }, // our-domain.com/teams => TeamsList
    { path: '/categories', component: CategoryList }, // our-domain.com/teams => TeamsList
    { path: '/budget', component: BudgetList }, // our-domain.com/teams => TeamsList
    {
      path: '/balances',
      component: BalanceList,
      props: true,
    },
    { path: '/auth', component: UserAuth, meta: { requiresUnauth: true }  },
    { path: '/tabs', component: Tabs },
    // { path: '/:notFound(.*)', component: NotFound }
  ]
});

router.beforeEach(function (to, _, next) {
  const { isAuthenticated } = useAuthStore();
  console.log(isAuthenticated);
  if (!isAuthenticated && !to.meta.requiresUnauth) {
    next('/auth');
  } else {
    next();
  }
});

export default router;
