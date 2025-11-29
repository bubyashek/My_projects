import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('@/views/LoginPage.vue'),
    },
    {
      path: '/broker/:id',
      name: 'Broker',
      component: () => import('@/views/BrokerPage.vue'),
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/AdminPage.vue'),
      //component: { template: '<div></div>' },
      //beforeEnter() {
      //  // Open lab5 admin page in new tab
      //  window.open('http://localhost:5173', '_blank');
      //  return false;
      //},
    },
    {
      path: '/stocks',
      name: 'Stocks',
      component: { template: '<div></div>' },
      beforeEnter() {
        window.open('http://localhost:5173', '_blank');
        return false;
      },
    },
  ],
});

export default router;


