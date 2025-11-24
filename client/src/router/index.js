import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// --- VIEW CUSTOMER ---
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

// --- VIEW MITRA (UPDATE) ---
import MitraLandingView from '@/views/Mitra/MitraLandingView.vue'
import MitraRegistrationView from '@/views/Mitra/MitraRegistrationView.vue'

// 1. Dashboard Pesanan (Halaman Utama Mitra)
import MitraProperty from '@/views/Mitra/MitraProperty.vue' // [TAMBAHAN 2]

// 2. CRUD Tempat (Kelola Kolam)
import Properti from '@/views/Mitra/Properti.vue'
import AddPlace from '@/views/Mitra/AddPlace.vue'
import EditPlace from '@/views/Mitra/EditPlace.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ==============================
    // PUBLIC ROUTES
    // ==============================
    { path: '/', name: 'home', component: Home },
    { path: '/index', name: 'index', component: Index },
    { path: '/ensiklopedia', name: 'ensiklopedia', component: Ensiklopedia },
    {
      path: '/search',
      name: 'search',
      component: Search,
      props: (route) => ({ location: route.query.location })
    },
    {
      path: '/detail/:id',
      name: 'DetailTempatPemancing',
      component: DetailTempatPemancingan,
      props: true
    },

    // ==============================
    // PROTECTED CUSTOMER ROUTES
    // ==============================
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true }
    },
    {
      path: '/pesanan',
      name: 'pesanan',
      component: Pesanan,
      meta: { requiresAuth: true }
    },
    {
      path: '/detailpesanan/:orderId',
      name: 'detailpesanan',
      component: DetailPesanan,
      props: true,
      meta: { requiresAuth: true }
    },
    {
      path: '/booking/:id',
      name: 'Booking',
      component: Booking,
      meta: { hideFooter: true, requiresAuth: true }
    },
    {
      path: '/booking/create/:id',
      name: 'BookingCreate',
      component: Booking,
      meta: { hideFooter: true, requiresAuth: true }
    },
    {
      path: '/payment',
      name: 'payment',
      component: Payment,
      meta: { hideFooter: true, requiresAuth: true }
    },
    {
      path: '/paymentconfirmation',
      name: 'paymentconfirmation',
      component: PaymentConfirmation,
      meta: { hideFooter: true, requiresAuth: true }
    },
    {
      path: '/ulasan/:orderId',
      name: 'formulasan',
      component: FormUlasanView,
      props: true,
      meta: { requiresAuth: true }
    },

    // ==============================
    // MITRA ROUTES
    // ==============================
    {
      path: '/mitra',
      name: 'mitra-landing',
      component: MitraLandingView
    },
    {
      path: '/mitra/daftar',
      name: 'mitra-register',
      component: MitraRegistrationView
    },

    // DASHBOARD PESANAN (Halaman "Properti Saya")
    {
      path: '/mitra/properti',
      name: 'mitra-property',
      component: MitraProperty,
      meta: { requiresMitra: true } // [TAMBAHAN 4] Proteksi
    },

    // CRUD TEMPAT (Kelola Daftar Kolam)
    {
      path: '/mitra/properti-list',
      name: 'mitra-place-list',
      component: Properti,
      meta: { requiresMitra: true }
    },
    {
      path: '/mitra/properti/tambah',
      name: 'mitra-add-place',
      component: AddPlace,
      meta: { requiresMitra: true } // [TAMBAHAN 4] Proteksi
    },
    {
      path: '/mitra/properti/edit/:id',
      name: 'mitra-edit-place',
      component: EditPlace,
      meta: { requiresMitra: true } // [TAMBAHAN 4] Proteksi
    }
  ],
})

// NAVIGATION GUARD (FIXED)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 1. Cek Route Customer (requiresAuth)
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      next({ name: 'home' }) // Redirect ke home (atau buka modal)
    } else {
      next()
    }
  }
  // 2. Cek Route Mitra (requiresMitra) [TAMBAHAN 5]
  else if (to.meta.requiresMitra) {
    // Cek apakah user login DAN tipenya mitra
    if (!authStore.isAuthenticated || !authStore.isMitra) {
      next({ name: 'mitra-login' }) // Lempar ke login mitra khusus
    } else {
      next()
    }
  }
  // 3. Route Public
  else {
    next()
  }
})

export default router
