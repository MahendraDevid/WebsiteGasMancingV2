<template>
  <div id="app-wrapper">
    <Navbar 
      @open-modal="openModal" 
      :is-logged-in="isLoggedIn"
      @logout="handleLogout"
      @toggle-profile="handleToggleProfile" 
    /> 
    
    <main class="main-content">
      <RouterView /> 
    </main>
    
    <Footer v-if="!route.meta.hideFooter" />

    <LoginRegisterModal
      :is-visible="isModalVisible && modalType === 'login'"
      title="Masuk Akun"
      modal-type="login"
      @close="closeModal"
      @login="handleUserLogin"
      @open-modal="openModal" 
    />
    <LoginRegisterModal
      :is-visible="isModalVisible && modalType === 'register'"
      title="Daftar Akun Baru"
      modal-type="register"
      @close="closeModal"
      @register="handleUserRegistration" 
      @open-modal="openModal" 
    />

    <UserProfileDropdown 
      :is-visible="isProfileVisible"
      @close="handleToggleProfile(false)"
      @logout="handleLogout"
      @edit-profile="handleOpenEditProfile"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from './components/NavBar.vue' 
// BARU: Impor komponen Modal
import LoginRegisterModal from '@/components/LoginRegister.vue'
import { useRoute } from 'vue-router'

//  Data/State untuk mengontrol Modal (Dipindahkan dari HomeView)
import Footer from './components/Footer.vue' 
// Impor dropdown profil
import UserProfileDropdown from '@/components/UserProfileDropdown.vue';

// --- STATE AUTENTIKASI ---
const isLoggedIn = ref(false); 

// --- STATE MODAL LOGIN/REGISTER ---
const isModalVisible = ref(false);
const modalType = ref('');
const route = useRoute();

// --- STATE MODAL PROFIL ---
const isProfileVisible = ref(false); // State untuk dropdown profil

// --- FUNGSI MODAL (LOGIN/REG/EDIT) ---
const openModal = (type) => {
  console.log(`[App] Buka Modal: ${type}`);
  modalType.value = type;
  isModalVisible.value = true;
  document.body.style.overflow = 'hidden';
  isProfileVisible.value = false; // Tutup dropdown profil jika terbuka
};

const closeModal = () => {
  isModalVisible.value = false;
  modalType.value = '';
  document.body.style.overflow = '';
};

// --- FUNGSI DROPDOWN PROFIL ---
const handleToggleProfile = (forceState) => {
  // forceState digunakan oleh tombol close
  if (typeof forceState === 'boolean') {
    isProfileVisible.value = forceState;
  } else {
    isProfileVisible.value = !isProfileVisible.value;
  }
};

const handleOpenEditProfile = () => {
  isProfileVisible.value = false; // Tutup dropdown
  openModal('edit-profile'); // Buka modal edit profile
};

// --- FUNGSI AUTENTIKASI ---
const handleUserLogin = (data) => {
  console.log('LOGIN diproses:', data);
  isLoggedIn.value = true; 
  closeModal();
};

const handleUserRegistration = (data) => {
  console.log('REGISTER diproses:', data);
  isLoggedIn.value = true; 
  closeModal();
};

const handleLogout = () => {
  console.log('User logout.');
  isLoggedIn.value = false;
  isProfileVisible.value = false; // Tutup dropdown jika sedang terbuka
};

const handleUpdateProfile = (data) => {
  console.log('PROFIL DIPERBARUI:', data);
  // Kirim data ke backend...
  closeModal();
};
</script>

<style scoped>
/* Anda mungkin memiliki style global di sini, atau membiarkannya kosong jika sudah di main.css */
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