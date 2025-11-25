<script setup>
import { useRouter } from 'vue-router';
import { onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// Gunakan Data dari Store (Lebih Aman & Reaktif)
const currentUser = computed(() => authStore.user);
const isMitra = computed(() => authStore.isMitra);
const isAuthenticated = computed(() => authStore.isAuthenticated);

onMounted(() => {
  authStore.loadUserFromStorage();
});

function handleDaftarClick() {
  // KONDISI A: Jika sudah login sebagai Mitra -> Masuk Dashboard
  if (isMitra.value) {
    router.push({ name: 'mitra-property' });
    return;
  }

  // KONDISI B: Jika login sebagai Customer -> Tawarkan Ganti Akun
  if (isAuthenticated.value && !isMitra.value) {
    const confirmSwitch = confirm(
      `Halo ${currentUser.value?.nama_lengkap || 'Pelanggan'}.\n` +
      "Anda sedang login sebagai Pelanggan.\n\n" +
      "Ingin KELUAR sekarang untuk mendaftar/masuk sebagai Mitra?"
    );

    if (confirmSwitch) {
      authStore.logout(); // Logout Customer
      window.location.reload(); // Reload halaman agar tombol "Masuk" di Navbar muncul lagi
    }
    return;
  }

  // KONDISI C: Belum Login -> Lanjut ke Form Pendaftaran
  router.push({ name: 'mitra-register' });
}
</script>

<template>
  <main class="mitra-landing-wrapper">
    <div class="mitra-hero-section">

      <h1 class="mitra-hero-title">Gabung Jadi Mitra GasMancing</h1>

      <p class="mitra-hero-subtitle">
        Kelola kolam pemancingan Anda secara digital, pantau pesanan secara real-time, dan dapatkan ribuan pelanggan
        baru.
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
        {{ isMitra ? 'Buka Dashboard Mitra' : 'Mulai Daftarkan Properti' }}
      </button>

      <div v-if="isAuthenticated && !isMitra" class="alert-box" @click="handleDaftarClick" style="cursor: pointer;">
        <p>Halo <b>{{ currentUser?.nama_lengkap }}</b>. Bukan akun Mitra? <u>Klik di sini untuk Ganti Akun</u>.</p>
      </div>

    </div>
  </main>
</template>

<style scoped src="./MitraLanding.style.css"></style>