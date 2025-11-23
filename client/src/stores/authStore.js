import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // ==========================================
  // STATE
  // ==========================================
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // ==========================================
  // GETTERS
  // ==========================================
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)
  
  // Cek Admin
  const isAdmin = computed(() => user.value?.tipe_user === 'admin')
  
  // Cek Mitra (Asumsi backend mengirim field 'role' atau 'tipe_user' = 'mitra')
  const isMitra = computed(() => user.value?.tipe_user === 'mitra' || user.value?.role === 'mitra')

  // ==========================================
  // ACTIONS: USER BIASA
  // ==========================================
  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.login(credentials)

      if (response.data.success) {
        const tokenRes = response.data.data.token
        const userRes = response.data.data.user

        // Set State
        token.value = tokenRes
        user.value = userRes

        // Simpan ke LocalStorage
        localStorage.setItem('token', tokenRes)
        localStorage.setItem('user', JSON.stringify(userRes))

        return { success: true }
      }

      return { success: false, error: response.data.message || 'Login gagal' }
    } catch (err) {
      error.value = err.response?.data?.message || 'Login gagal'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.register(userData)

      if (response.data.success) {
        return {
          success: true,
          message: response.data.message,
          id_pengguna: response.data.id_pengguna,
        }
      } else {
        return {
          success: false,
          error: response.data.message || 'Registrasi gagal',
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Registrasi gagal'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ==========================================
  // ACTIONS: MITRA (BARU)
  // ==========================================
  
  // 1. Register Mitra
  const registerMitra = async (mitraData) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.createMitra(mitraData)

      if (response.data.success) {
        // === UPDATE BAGIAN INI UNTUK MENYAMBUNGKAN AUTH ===
        const tokenRes = response.data.data.token
        const userRes = response.data.data.mitra

        // Simpan ke State Pinia
        token.value = tokenRes
        user.value = userRes

        // Simpan ke LocalStorage agar tidak hilang saat refresh
        localStorage.setItem('token', tokenRes)
        localStorage.setItem('user', JSON.stringify(userRes))
        // ===================================================

        return {
          success: true,
          message: response.data.message || 'Registrasi Mitra Berhasil',
        }
      } else {
        return {
          success: false,
          error: response.data.message || 'Registrasi Mitra gagal',
        }
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mendaftar sebagai mitra'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // 2. Login Mitra
  const loginMitra = async (credentials) => {
    try {
      loading.value = true
      error.value = null

      // Pastikan api.loginMitra sudah dibuat di api.js
      const response = await api.loginMitra(credentials)

      if (response.data.success) {
        const tokenRes = response.data.data.token
        const userRes = response.data.data.mitra // Biasanya backend return object 'mitra' bukan 'user'

        // Kita tambahkan flag tipe_user manual jika backend tidak mengirimnya
        if (userRes && !userRes.tipe_user) {
            userRes.tipe_user = 'mitra'; 
        }

        token.value = tokenRes
        user.value = userRes

        localStorage.setItem('token', tokenRes)
        localStorage.setItem('user', JSON.stringify(userRes))

        return { success: true }
      }

      return { success: false, error: response.data.message || 'Login Mitra gagal' }
    } catch (err) {
      error.value = err.response?.data?.message || 'Login Mitra gagal'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // ==========================================
  // ACTIONS: UMUM (LOGOUT & PROFILE)
  // ==========================================
  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Opsional: Redirect ke halaman home
    // window.location.href = '/' 
  }

  const loadUserFromStorage = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken) token.value = storedToken

    try {
      if (storedUser && storedUser !== 'undefined') {
        user.value = JSON.parse(storedUser)
      }
    } catch (e) {
      console.warn('User JSON invalid, clearing localStorage')
      localStorage.removeItem('user')
    }
  }

  const fetchProfile = async () => {
    try {
      // Logic untuk mengambil profile. 
      // Jika endpoint user dan mitra beda, kita bisa cek tipe user dulu
      if (isMitra.value) {
         // const response = await api.getMitraProfile() // Jika ada endpoint khusus
         // user.value = response.data.data
      } else {
         const response = await api.getProfile()
         if (response.data.success) {
            user.value = response.data.data
            localStorage.setItem('user', JSON.stringify(response.data.data))
         }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      error.value = null
      
      // Bisa ditambahkan logika if(isMitra) jika endpoint update beda
      const response = await api.updateProfile(profileData)

      if (response.data.success) {
        const updatedUser = {
          ...user.value,
          ...profileData,
        }

        delete updatedUser.password 
        delete updatedUser.password_hash

        user.value = updatedUser
        localStorage.setItem('user', JSON.stringify(updatedUser))

        return {
          success: true,
          message: response.data.message,
        }
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Gagal memperbarui profil'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const changePassword = async (passwordData) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.changePassword(passwordData)

      if (response.data.success) {
        return { success: true, message: response.data.message }
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Gagal mengubah password'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  // Initialize
  loadUserFromStorage()

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    currentUser,
    isAdmin,
    isMitra, // Export getter baru
    login,
    register,
    loginMitra, // Export action baru
    registerMitra, // Export action baru
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
    loadUserFromStorage,
  }
})