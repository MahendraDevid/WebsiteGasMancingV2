<template>
  <div id="app-wrapper">
    <!-- Dengarkan event @openModal dari Navbar dan panggil fungsi openModal -->
    <Navbar @open-modal="openModal" /> 
    
    <main class="main-content">
      <RouterView /> 
    </main>
    
    <Footer /> 

    <!-- Komponen Modal untuk LOGIN -->
    <LoginRegisterModal
      :is-visible="isModalVisible && modalType === 'login'"
      title="Masuk Akun"
      modal-type="login"
      @close="closeModal"
      @login="handleUserLogin"
      @open-modal="openModal"
    />

    <!-- Komponen Modal untuk REGISTER -->
    <LoginRegisterModal
      :is-visible="isModalVisible && modalType === 'register'"
      title="Daftar Akun Baru"
      modal-type="register"
      @close="closeModal"
      @register="handleUserRegistration" 
      @open-modal="openModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from './components/NavBar.vue' 
import Footer from './components/Footer.vue' 
// BARU: Impor komponen Modal
import LoginRegisterModal from '@/components/LoginRegister.vue'

// BARU: Data/State untuk mengontrol Modal (Dipindahkan dari HomeView)
const isModalVisible = ref(false)
const modalType = ref('')

// BARU: Metode untuk membuka modal (Dipindahkan dari HomeView)
const openModal = (type) => {
  console.log(`[App] Event diterima, tipe modal: ${type}`) // BARU
  modalType.value = type
  isModalVisible.value = true
  document.body.style.overflow = 'hidden'
}

// BARU: Metode untuk menutup modal (Dipindahkan dari HomeView)
const closeModal = () => {
  isModalVisible.value = false
  modalType.value = ''
  // Aktifkan kembali scroll body
  document.body.style.overflow = ''
}

// BARU: Handler untuk proses Login (Contoh)
const handleUserLogin = (data) => {
  console.log('Login diproses dengan data:', data)
  alert(`Login berhasil! Email: ${data.email}`)
  closeModal()
}

// BARU: Handler untuk proses Register (Contoh)
const handleUserRegistration = (data) => {
  console.log('Registrasi diproses dengan data:', data)
  alert(`Form registrasi dikirim! Email: ${data.email}.`)
  // Logika registrasi...
  closeModal()
}
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
  /* Tambahkan padding top agar konten tidak tertutup navbar fixed */
  padding-top: 75px; /* Sesuaikan dengan tinggi navbar Anda */
}
</style>