import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView/HomeView.vue'
import Search from '../views/Search/Search.vue' 
import Pesanan from '../views/Pesanan/Pesanan.vue'

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
    {
    path: '/search',
      name: 'search',
      component: Search,
      props: (route) => ({ location: route.query.location }),
    },
    {
      path: '/pesanan',
      name: 'pesanan',
      component: Pesanan
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('../views/DetailTempatPemancinganView/DetailTempatPemancinganView.vue'),
    },
  ],
})

export default router