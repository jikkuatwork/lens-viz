import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const useSPA = import.meta.env.VITE_SPA_ROUTING === 'true'

const router = createRouter({
  history: useSPA ? createWebHistory() : createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/slide/00' },
    { path: '/slide/00', name: 'welcome', component: () => import('./slides/00_Welcome.vue') },
    { path: '/slide/:num', name: 'slide', component: () => import('./components/PipelineView.vue') },
  ],
})

export default router
