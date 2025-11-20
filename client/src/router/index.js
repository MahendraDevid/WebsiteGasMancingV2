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
import DetailPesanan from '@/views/DetailPesanan/DetailPesanan.vue'
import Index from '@/views/Index/IndexView.vue'
import FormUlasanView from '@/views/FormUlasan/FormUlasanView.vue'
import MitraLandingView from '@/views/Mitra/MitraLandingView.vue';
import MitraRegistrationView from '@/views/Mitra/MitraRegistrationView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
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
    {
      path: '/detailpesanan/:orderId',
      name: 'detailpesanan',
      component: DetailPesanan,
    },
    {
      path: '/ulasan/:orderId',
      name: 'formulasan', // Nama ini harus sama dengan di router.push
      component: FormUlasanView,
      props: true // Opsional, tapi good practice agar parameter bisa jadi props
    },
      // Route Halaman Utama Mitra
    {
      path: '/mitra',
      name: 'mitra-landing',
      component: MitraLandingView
    },
    // Route Form Pendaftaran
    {
      path: '/mitra/daftar',
      name: 'mitra-register',
      component: MitraRegistrationView
    },
  ],
})

export default router
