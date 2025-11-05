import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView/HomeView.vue'
import Search from '../views/Search/Search.vue' 
import Payment from '@/views/Payment/Payment.vue'
import PaymentConfirmation from '@/views/PaymentConfirmation/PaymentConfirmation.vue'

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
      path: '/payment',
      name: 'payment',
      component: Payment
    },
    {
<<<<<<< HEAD
      path: '/detail',
      name: 'detail',
      component: () => import('../views/DetailTempatPemancinganView/DetailTempatPemancinganView.vue'),
=======
      path: '/paymentconfirmation',
      name: 'paymentconfirmation',
      component: PaymentConfirmation
>>>>>>> 00ac25507c8ea55072e26e87585ba1b086f0e39a
    },
  ],
})

export default router