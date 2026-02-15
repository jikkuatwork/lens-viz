import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import PipelinePage from './pages/pipeline/PipelinePage.vue'

const useSPA = import.meta.env.VITE_SPA_ROUTING === 'true'

const router = createRouter({
  history: useSPA ? createWebHistory() : createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/slide/1'
    },
    {
      path: '/slide/:index(\\d+)',
      name: 'pipeline-slide',
      component: PipelinePage
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/slide/1'
    }
  ]
})

export default router
