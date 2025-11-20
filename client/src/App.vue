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

    <!-- SINGLE UNIVERSAL MODAL (Login / Register / Edit Profile) -->
    <LoginRegisterModal :is-visible="isModalVisible" :modal-type="modalType" @close="closeModal"
      @login="handleUserLogin" @register="handleUserRegistration" @edit-profile="handleUpdateProfile"
      @open-modal="openModal" />

    <!-- PROFILE DROPDOWN -->
    <UserProfileDropdown :is-visible="isProfileVisible" @close="handleToggleProfile(false)" @logout="handleLogout"
      @edit-profile="handleOpenEditProfile" />

  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRoute, RouterView } from "vue-router"

// Components
import Navbar from "./components/NavBar.vue"
import Footer from "./components/Footer.vue"
import LoginRegisterModal from "@/components/LoginRegister.vue"
import UserProfileDropdown from "@/components/UserProfileDropdown.vue"

// Route
const route = useRoute()

// ================================
// AUTH STATE
// ================================
const isLoggedIn = ref(!!localStorage.getItem("token"))

// ================================
// MODAL SYSTEM
// ================================
const isModalVisible = ref(false)
const modalType = ref("") // "login" | "register" | "edit-profile"

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
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Login gagal");
      return;
    }

    // Save login data
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    isLoggedIn.value = true;
    closeModal();

  } catch (err) {
    console.error(err);
    alert("Kesalahan server");
  }
};

// ================================
// REGISTER HANDLER
// ================================
const handleUserRegistration = async ({ nama_lengkap, email, password }) => {
  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama_lengkap, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registrasi gagal");
      return;
    }

    alert("Registrasi berhasil!");

    // Move to login screen
    closeModal();
    openModal("login");

  } catch (err) {
    console.error(err);
    alert("Kesalahan server");
  }
};

// ================================
// LOGOUT HANDLER
// ================================
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  isLoggedIn.value = false;
  isProfileVisible.value = false;
};

// ================================
// UPDATE PROFILE (FUTURE FEATURE)
// ================================
const handleUpdateProfile = (payload) => {
  console.log("Profile updated:", payload);
  closeModal();
};
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
