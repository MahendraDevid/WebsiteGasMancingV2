import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)
  const isAdmin = computed(() => user.value?.tipe_user === 'admin')

  // Actions
  const login = async (credentials) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.login(credentials)

      if (response.data.success) {
        const tokenRes = response.data.data.token
        const userRes = response.data.data.user

        token.value = tokenRes
        user.value = userRes

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


  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const loadUserFromStorage = () => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken) token.value = storedToken

    // Hanya parse kalau JSON valid
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
      const response = await api.getProfile()
      if (response.data.success) {
        user.value = response.data.data
        localStorage.setItem('user', JSON.stringify(response.data.data))
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      loading.value = true
      error.value = null

      const response = await api.updateProfile(profileData)

      if (response.data.success) {
        user.value = response.data.data
        localStorage.setItem('user', JSON.stringify(response.data.data))
        return { success: true }
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
    login,
    register,
    logout,
    fetchProfile,
    updateProfile,
    changePassword,
    loadUserFromStorage,
  }
})