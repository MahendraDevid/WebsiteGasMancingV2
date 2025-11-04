import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/ensiklopedia',
      name: 'ensiklopedia',
      component: () => import('../views/EnsiklopediaView/EnsiklopediaView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/Profile/Profile.vue'),
    },
  ],
})

export default router