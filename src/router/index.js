import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView/HomeView.vue'
import Search from '../views/Search/Search.vue' 
import Payment from '@/views/Payment/Payment.vue'
import PaymentConfirmation from '@/views/PaymentConfirmation/PaymentConfirmation.vue'
import DetailTempatPemancinganView from '@/views/DetailTempatPemancinganView/DetailTempatPemancinganView.vue'
import Booking from '@/views/Booking/Booking.vue'
import Pesanan from '@/views/Pesanan/Pesanan.vue'

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
      component: Payment,
      meta: { hideFooter: true } 
    },
    {
      path: '/paymentconfirmation',
      name: 'paymentconfirmation',
      component: PaymentConfirmation,
      meta: { hideFooter: true } 
    },
    {
      path: '/detail/:id',
      name: 'DetailTempatPemancing',
      component: DetailTempatPemancinganView,
      props: true // Enable props passing from route params
    },
    {
      path: '/pesanan', // (Atau path apa pun yang Anda gunakan untuk booking)
      name: 'pesanan',
      component: Pesanan,
    },
    {
      path: '/booking', // (Atau path apa pun yang Anda gunakan untuk booking)
      name: 'booking',
      component: Booking,
      meta: { hideFooter: true } 
    },
  ],
})

export default router