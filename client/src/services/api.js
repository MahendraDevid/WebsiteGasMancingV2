import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token (if needed later)
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here later
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
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
  }, // ============ Booking API ============
  // Create new booking

  createBooking(data) {
    return apiClient.post('/bookings', data)
  }, // Get booking by ID

  getBookingById(id) {
    return apiClient.get(`/bookings/${id}`)
  }, // Get all bookings

  getAllBookings() {
    return apiClient.get('/bookings')
  }, // Get bookings by user ID

  getUserBookings(userId) {
    return apiClient.get(`/bookings/user/${userId}`)
  }, // Update booking status

  updateBookingStatus(id, status) {
    return apiClient.put(`/bookings/${id}/status`, { status })
  }, // Delete booking

  deleteBooking(id) {
    return apiClient.delete(`/bookings/${id}`)
  }, // ============ Users API ============
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
}
