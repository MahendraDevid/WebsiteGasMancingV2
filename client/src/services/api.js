import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json', // Default global adalah JSON
  },
})

// Request Interceptor (Auth Token)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// Response Interceptor (Error Handling)
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  },
)

export default {
  // ============ Places API ============
  getAllPlaces() {
    return apiClient.get('/places')
  },
  getPlaceById(id) {
    return apiClient.get(`/places/${id}`)
  },
  getEquipmentListByPlace(placeId) {
    return apiClient.get(`/item_sewa/place/${placeId}`)
  },
  searchPlaces(params) {
    return apiClient.get('/places/search', { params: params })
  },
  createPlace(data) {
    return apiClient.post('/places', data)
  },

  // ============ Ensiklopedia API ============
  getAllEnsiklopedia() {
    return apiClient.get('/ensiklopedia')
  },
  getEnsiklopediaById(id) {
    return apiClient.get(`/ensiklopedia/${id}`)
  },

  // ============ Booking API ============
  getAllBookings() {
    return apiClient.get('/booking')
  },
  getBookingById(id) {
    return apiClient.get(`/booking/${id}`)
  },
  createBooking(data) {
    return apiClient.post('/booking/create', data)
  },
  getUserBookings(userId) {
    return apiClient.get(`/booking/user/${userId}`)
  },
  updateBookingStatus(id, status) {
    return apiClient.put(`/booking/${id}/status`, { status })
  },
  deleteBooking(id) {
    return apiClient.delete(`/booking/${id}`)
  },

  // ============ Review API ============
  getReviewByPlace(placeId) {
    return apiClient.get(`/review/place/${placeId}`)
  },
  getReviewByUser(userId) {
    return apiClient.get(`/review/user/${userId}`)
  },
  createReview(data) {
    return apiClient.post('/review', data)
  },
  deleteReview(id, placeId = null) {
    return apiClient.delete(`/review/${id}`, {
      data: { placeId },
    })
  },

  // ============ Payment API ============
  createPayment(data) {
    return apiClient.post('/payment', data)
  },
  getPaymentByBookingId(bookingId) {
    return apiClient.get(`/payment/booking/${bookingId}`)
  },
  updatePaymentStatus(idPesanan, status) {
    return apiClient.put(`/payment/${idPesanan}/status`, {
      status_pembayaran: status
    })
  },
  simulatePaymentWebhook(data) {
    return apiClient.post('/payment/webhook/simulate', data)
  },
  getPaymentConfirmation(nomorPesanan) {
    return apiClient.get(`/paymentConfirmation/${nomorPesanan}`)
  },

  // ============ Users API ============
  getAllUsers() {
    return apiClient.get('/users')
  },
  getUserById(id) {
    return apiClient.get(`/users/${id}`)
  },
  createUser(data) {
    return apiClient.post('/users', data)
  },
  updateUser(id, data) {
    return apiClient.put(`/users/${id}`, data)
  },
  deleteUser(id) {
    return apiClient.delete(`/users/${id}`)
  },

  // ============ Auth API ============
  register(data) {
    return apiClient.post('/auth/register', data)
  },
  login(data) {
    return apiClient.post('/auth/login', data)
  },
  getProfile() {
    return apiClient.get('/auth/me')
  },

  // ============ Mitra API (BAGIAN UTAMA YANG DIUBAH) ============
  
  createMitra(data) {
    // PENTING: Kita override header menjadi 'multipart/form-data'
    // agar backend bisa menerima File Gambar + Data Teks.
    return apiClient.post('/mitra/register', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  loginMitra(data) {
    // Login tetap pakai JSON biasa, tidak perlu override header
    return apiClient.post('/mitra/login', data)
  },

  getMitraById(id) {
    return apiClient.get(`/mitra/${id}`)
  },

  updateMitra(id, data) {
    return apiClient.put(`/mitra/${id}`, data)
  },

  deleteMitra(id) {
    return apiClient.delete(`/mitra/${id}`)
  },
  // ============ Pesanan API (BARU) ============
  /**
   * Mengambil semua pesanan pengguna yang sedang login.
   * Endpoint: GET /api/pesanan/my-orders
   */
  getAllPesananByUserId() {
    // ID pengguna harusnya diambil dari token di interceptor, jadi endpoint ini
    // tidak memerlukan ID sebagai argumen.
    return apiClient.get('/pesanan/my-orders')
  },

  getPesananById(id) {
    return apiClient.get(`/pesanan/${id}`)
  },

  /**
   * Membatalkan pesanan.
   * Endpoint: POST /api/pesanan/cancel/:id
   */
  cancelPesanan(id) {
    return apiClient.post(`/pesanan/cancel/${id}`)
  },

  /**
   * Membuat pesanan baru (biasanya dipanggil dari halaman Booking/Payment)
   * Endpoint: POST /api/pesanan/create
   */
  createPesanan(data) {
    return apiClient.post('/pesanan/create', data)
  },
}
