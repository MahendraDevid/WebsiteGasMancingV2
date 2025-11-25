<template>
  <div id="app-wrapper">
    <div class="nav-filler">
      <!-- To make space for fixed navbar -->
    </div>

    <!-- NAVBAR -->
    <Navbar :is-logged-in="isLoggedIn" @open-modal="openModal" @logout="handleLogout"
      @toggle-profile="handleToggleProfile" />

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <RouterView />
    </main>

    <!-- FOOTER -->
    <Footer v-if="!route.meta.hideFooter" />

    <!-- LOGIN / REGISTER MODAL -->
    <LoginRegisterModal :is-visible="isModalVisible" :modal-type="modalType" :title="modalTitle" @close="closeModal"
      @login="handleUserLogin" @register="handleUserRegistration" @open-modal="openModal"
      @success="handleAuthSuccess" />

    <!-- PROFILE DROPDOWN -->
    <UserProfileDropdown :is-visible="isProfileVisible" @close="handleToggleProfile(false)" @logout="handleLogout"
      @edit-profile="handleOpenEditProfile" />

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRoute, RouterView } from "vue-router"

import Navbar from "./components/NavBar.vue"
import Footer from "./components/Footer.vue"
import LoginRegisterModal from "@/components/LoginRegister.vue"
import UserProfileDropdown from "@/components/UserProfileDropdown.vue"

import { useAuthStore } from "@/stores/authStore"
const authStore = useAuthStore()

const route = useRoute()

// 🔥 Restore user saat reload halaman
onMounted(() => {
  authStore.loadUserFromStorage()
})

// 🔥 isLoggedIn reactive dari Pinia
const isLoggedIn = computed(() => authStore.isAuthenticated)

// ================================
// MODAL SYSTEM
// ================================
const isModalVisible = ref(false)
const modalType = ref("")

const modalTitle = computed(() => {
  if (modalType.value === "login") return "Masuk Akun"
  if (modalType.value === "register") return "Daftar Akun"
  if (modalType.value === "edit-profile") return "Edit Profil"
  return ""
})

const openModal = (type) => {
  modalType.value = type
  isModalVisible.value = true
  isProfileVisible.value = false
  document.body.style.overflow = "hidden"
}

const closeModal = () => {
  isModalVisible.value = false
  modalType.value = ""
  document.body.style.overflow = ""
}

// PROFILE DROPDOWN
const isProfileVisible = ref(false)
const handleToggleProfile = () => {
  isProfileVisible.value = !isProfileVisible.value
}

// LOGIN
const handleUserLogin = async ({ email, password }) => {
  const result = await authStore.login({ email, password })
  if (result.success) closeModal()
  else alert(result.error)
}

// REGISTER
const handleUserRegistration = async ({ nama_lengkap, email, password }) => {
  const result = await authStore.register({ nama_lengkap, email, password })
  if (result.success) {
    closeModal()
    openModal("login")
  } else alert(result.error)
}

// LOGOUT
const handleLogout = () => {
  authStore.logout()
  isProfileVisible.value = false
}

const handleAuthSuccess = () => {
  // setelah login, navbar langsung berubah
  authStore.loadUserFromStorage()
  isProfileVisible.value = false
  closeModal()
}
</script>


<style scoped>
body {
  background-color: #FFFFFF;
}
#app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
}

.main-content {
  flex-grow: 1;
  background-color: #FFFFFF;
}

.nav-filler {
  background-color: var(--bay-of-many);
  height: 75px;
}
</style>