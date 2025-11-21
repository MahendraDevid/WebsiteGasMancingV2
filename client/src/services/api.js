import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    // NOTE: Implementasi ini menggunakan localStorage, pastikan Anda menggunakan
    // sistem otentikasi yang sama di aplikasi Anda (e.g. Firebase Auth)
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      // Server responded with error
      console.error('API Error:', error.response.data)
    } else if (error.request) {
      // Request made but no response
      console.error('Network Error:', error.request)
    } else {
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  },
)

export default {
  // ============ Places API ============

  // Get all places
  getAllPlaces() {
    return apiClient.get('/places')
  }, // Get place by ID

  getPlaceById(id) {
    return apiClient.get(`/places/${id}`)
  }, // Search places by keyword

  getEquipmentListByPlace(placeId) {
    // Asumsi endpoint di backend adalah /item_sewa/place/{id_tempat}
    return apiClient.get(`/item_sewa/place/${placeId}`)
  },

  searchPlaces(params) {
    // ✅ Terima objek params
    return apiClient.get('/places/search', { params: params })
  }, // Create new place (admin only)

  createPlace(data) {
    return apiClient.post('/places', data)
  },

  // ============ Ensiklopedia API ============

  /**
   * Mengambil semua artikel Ensiklopedia.
   * Endpoint: GET /api/ensiklopedia
   */
  getAllEnsiklopedia() {
    return apiClient.get('/ensiklopedia')
  },

  /**
   * Mengambil detail satu artikel Ensiklopedia.
   * Endpoint: GET /api/ensiklopedia/:id
   */
  getEnsiklopediaById(id) {
    return apiClient.get(`/ensiklopedia/${id}`)
  },

  // ============ Booking API (Sudah ada, tapi kita fokus ke Pesanan) ============
  getAllBookings() {
    return apiClient.get('/booking')
  },
  getBookingById(id) {
    return apiClient.get(`/booking/${id}`)
  }, // ============ Booking API ============
  // Create new booking

  createBooking(data) {
    return apiClient.post('/booking/create', data)
  },

  // Get booking by ID
  getUserBookings(userId) {
    return apiClient.get(`/booking/user/${userId}`)
  },

  // Update booking status
  updateBookingStatus(id, status) {
    return apiClient.put(`/booking/${id}/status`, { status })
  }, // Delete booking

  deleteBooking(id) {
    return apiClient.delete(`/booking/${id}`)
  },

  // ============ Users API ============
  // Get all users

  getAllUsers() {
    return apiClient.get('/users')
  }, // Get user by ID

  getUserById(id) {
    return apiClient.get(`/users/${id}`)
  }, // Create new user

  createUser(data) {
    return apiClient.post('/users', data)
  }, // Update user

  updateUser(id, data) {
    return apiClient.put(`/users/${id}`, data)
  }, // Delete user

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
