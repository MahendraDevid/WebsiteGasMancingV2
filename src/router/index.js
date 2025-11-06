import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home/HomeView.vue'
import Search from '@/views/Search/SearchView.vue' 
import Payment from '@/views/Payment/PaymentView.vue'
import PaymentConfirmation from '@/views/PaymentConfirmation/PaymentConfirmationView.vue'
import DetailTempatPemancingan from '@/views/DetailTempatPemancingan/DetailTempatPemancinganView.vue'
import Booking from '@/views/Booking/BookingView.vue'
import Pesanan from '@/views/Pesanan/PesananView.vue'
import Ensiklopedia from '@/views/Ensiklopedia/EnsiklopediaView.vue'
import Profile from '@/views/Profile/ProfileView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/ensiklopedia',
      name: 'ensiklopedia',
      component: Ensiklopedia,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
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
      component: DetailTempatPemancingan,
      props: true
    },
    {
      path: '/pesanan',
      name: 'pesanan',
      component: Pesanan,
    },
    {
      path: '/booking',
      name: 'booking',
      component: Booking,
      meta: { hideFooter: true } 
    },
  ],
})

export default router