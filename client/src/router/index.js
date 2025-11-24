import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
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
import MitraLandingView from '@/views/Mitra/MitraLandingView.vue'
import MitraRegistrationView from '@/views/Mitra/MitraRegistrationView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public Routes
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
      path: '/search',
      name: 'search',
      component: Search,
      props: (route) => ({ location: route.query.location }),
    },
    {
      path: '/detail/:id',
      name: 'DetailTempatPemancing',
      component: DetailTempatPemancingan,
      props: true,
    },

    // Protected Routes (require authentication)
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: '/pesanan',
      name: 'pesanan',
      component: Pesanan,
      meta: { requiresAuth: true },
    },
    {
      path: '/detailpesanan/:orderId',
      name: 'detailpesanan',
      component: DetailPesanan,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/booking/:id',
      name: 'Booking',
      component: Booking,
      meta: {
        hideFooter: true,
        requiresAuth: true,
      },
    },
    {
      path: '/booking/create/:id',
      name: 'BookingCreate',
      component: Booking,
      meta: {
        hideFooter: true,
        requiresAuth: true,
      },
    },
    {
      path: '/payment',
      name: 'payment',
      component: Payment,
      meta: {
        hideFooter: true,
        requiresAuth: true,
      },
    },
    {
      path: '/paymentconfirmation',
      name: 'paymentconfirmation',
      component: PaymentConfirmation,
      meta: {
        hideFooter: true,
        requiresAuth: true,
      },
    },
    {
      path: '/ulasan/:orderId',
      name: 'formulasan',
      component: FormUlasanView,
      props: true,
      meta: { requiresAuth: true },
    },
    {
      path: '/mitra',
      name: 'mitra-landing',
      component: MitraLandingView,
    },
    {
      path: '/mitra/daftar',
      name: 'mitra-register',
      component: MitraRegistrationView,
    },
  ],
})

// Navigation Guard FIX
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect ke home
      next({ name: 'home' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
