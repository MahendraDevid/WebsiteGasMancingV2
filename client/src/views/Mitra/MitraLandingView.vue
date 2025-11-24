<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const currentUser = ref(null);

onMounted(() => {
  const userString = localStorage.getItem('user');
  if (userString) {
    currentUser.value = JSON.parse(userString);
  }
});

function handleDaftarClick() {
  if (currentUser.value && currentUser.value.tipe_user === 'mitra') {
      router.push({ name: 'mitra-property' });
      return;
  }
  if (currentUser.value && currentUser.value.tipe_user !== 'mitra') {
    alert("Anda sedang login sebagai Customer. Mohon logout terlebih dahulu.");
    return;
  }
  router.push({ name: 'mitra-register' });
}
</script>

<template>
  <main class="mitra-landing-wrapper">
    <div class="mitra-hero-section">

       <h1 class="mitra-hero-title">Gabung Jadi Mitra GasMancing</h1>

       <p class="mitra-hero-subtitle">
         Kelola kolam pemancingan Anda secara digital, pantau pesanan secara real-time, dan dapatkan ribuan pelanggan baru.
       </p>

       <div class="mitra-benefit-cards">
         <div class="mitra-benefit-item">
           <h3>📈 Jangkauan Luas</h3>
           <p>Dilihat oleh ribuan pemancing.</p>
         </div>
         <div class="mitra-benefit-item">
           <h3>⚡ Kelola Mudah</h3>
           <p>Atur jadwal & harga dalam genggaman.</p>
         </div>
         <div class="mitra-benefit-item">
           <h3>💰 Cuan Maksimal</h3>
           <p>Sistem booking online 24 jam.</p>
         </div>
       </div>

       <button class="mitra-cta-button" @click="handleDaftarClick">
         Mulai Daftarkan Properti
       </button>

       <div v-if="currentUser && currentUser.tipe_user !== 'mitra'" class="alert-box">
          <p>Halo <b>{{ currentUser.nama_lengkap }}</b>. Logout dulu untuk akses Mitra.</p>
       </div>

    </div>
  </main>
</template>

<style scoped src="./MitraLandingView.style.css"></style>