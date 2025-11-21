<template>
  <div id="app-wrapper">

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
    <LoginRegisterModal :is-visible="isModalVisible" :modal-type="modalType" :title="modalTitle"
      @close="closeModal"
      @login="handleUserLogin"
      @register="handleUserRegistration"
      @open-modal="openModal"
      />

      <!-- PROFILE DROPDOWN -->
      <UserProfileDropdown :is-visible="isProfileVisible" @close="handleToggleProfile(false)" @logout="handleLogout"
        @edit-profile="handleOpenEditProfile" />

  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRoute, RouterView } from "vue-router"

// Components
import Navbar from "./components/NavBar.vue"
import Footer from "./components/Footer.vue"
import LoginRegisterModal from "@/components/LoginRegister.vue"
import UserProfileDropdown from "@/components/UserProfileDropdown.vue"

// Router
const route = useRoute()

// ================================
// AUTH STATE
// ================================
const isLoggedIn = ref(!!localStorage.getItem("token"))

// ================================
// MODAL SYSTEM
// ================================
const isModalVisible = ref(false)
const modalType = ref("")   // login | register | edit-profile

// 🔥 FIX — title is generated here (not inside modal)
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

// ================================
// PROFILE DROPDOWN
// ================================
const isProfileVisible = ref(false)

const handleToggleProfile = (forceState) => {
  if (typeof forceState === "boolean") {
    isProfileVisible.value = forceState
  } else {
    isProfileVisible.value = !isProfileVisible.value
  }
}

const handleOpenEditProfile = () => {
  isProfileVisible.value = false
  openModal("edit-profile")
}

// ================================
// LOGIN HANDLER
// ================================
const handleUserLogin = async ({ email, password }) => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || "Login gagal")
      return
    }

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user))

    isLoggedIn.value = true
    closeModal()

  } catch (err) {
    console.error(err)
    alert("Kesalahan server")
  }
}

// ================================
// REGISTER HANDLER
// ================================
const handleUserRegistration = async ({ nama_lengkap, email, password }) => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_lengkap, email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      alert(data.message || "Registrasi gagal")
      return
    }

    alert("Registrasi berhasil!")
    closeModal()
    openModal("login")

  } catch (err) {
    console.error(err)
    alert("Kesalahan server")
  }
}

// ================================
// LOGOUT
// ================================
const handleLogout = () => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  isLoggedIn.value = false
  isProfileVisible.value = false
}

// ================================
// UPDATE PROFILE (NEXT FEATURE)
// ================================
const handleUpdateProfile = () => {
  closeModal()
}
</script>

<style scoped>
#app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex-grow: 1;
  padding-top: 75px;
}
</style>
