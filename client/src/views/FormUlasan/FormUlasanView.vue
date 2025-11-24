<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api';
import { useAuthStore } from '../../stores/authStore';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const orderId = route.params.orderId;

// State Form
const rating = ref(0);
const comment = ref('');
const orderData = ref(null); // Akan diisi data booking/pesanan yang sebenarnya
const loading = ref(true); // Status loading data
const submitting = ref(false); // Status submit form

// State Modal
const showSuccessModal = ref(false);

const currentUserId = authStore.currentUser?.id_pengguna;

// =======================================================
// FUNGSI: Mengambil Detail Pesanan (Untuk mendapatkan Place ID)
// =======================================================
async function fetchOrderData() {
    loading.value = true;
    try {
        // Panggil API untuk mendapatkan detail pesanan
        const response = await api.getBookingById(orderId);
        const data = response.data.data;

        // Data yang kita butuhkan: Place ID (untuk payload review) dan info tampilan
        orderData.value = {
            id: data.id,
            placeId: data.placeId, // Kunci: id_tempat di backend
            title: data.placeTitle,
            location: data.placeLocation,
            image: data.placeImage,
            date: data.startDate // Menggunakan tanggal mulai sewa/pesanan
        };
    } catch (error) {
        console.error("Gagal mengambil detail pesanan:", error.response?.data || error.message);
        console.error("Gagal memuat data pesanan. Kembali ke halaman pesanan.");
        router.push({ name: 'pesanan' }); // Kembali jika gagal
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
      if (!orderId) {
        console.error('ID Pesanan tidak ditemukan.');
        router.push({ name: 'pesanan' });
        return;
    }
    if (!currentUserId) {
        console.error('Pengguna belum login. Arahkan ke halaman login.');
        // Jika belum login, arahkan ke login dan simpan rute saat ini sebagai redirect
        router.push({ name: 'login', query: { redirect: route.fullPath } });
        return;
    }
    fetchOrderData(); 
});

const setRating = (star) => {
    rating.value = star;
};

// =======================================================
// FUNGSI: Mengirim Ulasan
// =======================================================
const submitReview = async () => {
    if (!currentUserId) {
        console.error("Pengguna tidak terautentikasi. Gagal mengirim ulasan.");
        router.push({ name: 'login', query: { redirect: route.fullPath } });
        return;
    }
    
    if (rating.value === 0) {
        alert("Mohon berikan rating bintang sebelum mengirim ulasan.");
        return;
    }
    if (submitting.value) return; // Mencegah double submit
    
    if (!orderData.value || !orderData.value.placeId) {
        console.error("Detail pesanan atau ID Tempat belum termuat.");
        return;
    }
    
    // 1. Persiapan Payload
    const reviewPayload = {
        id_tempat: orderData.value.placeId, // Diambil dari data yang di-fetch
        id_pengguna: currentUserId,
        score: rating.value,
        comment: comment.value,
    };

    submitting.value = true;

    try {
        // 2. Panggil API Review (POST /api/review)
        await api.createReview(reviewPayload);

        // 3. Sukses: Munculkan Modal dan Redirect
        showSuccessModal.value = true;

    } catch (error) {
        console.error("Gagal mengirim ulasan:", error.response?.data || error.message);
        alert("Gagal mengirim ulasan: " + (error.response?.data?.message || "Kesalahan server."));
    } finally {
        submitting.value = false;
    }
};

const closeModal = () => {
    showSuccessModal.value = false;
    router.push({ name: 'pesanan' }); // Redirect ke pesanan
};
</script>

<template>
  <main class="ulasan-page-wrapper">
    <div v-if="loading" class="loading-overlay">
        <p>Memuat detail pesanan...</p>
    </div>
    
    <div v-else class="ulasan-container">
      <h1 class="ulasan-title">Beri Ulasan</h1>

      <div v-if="orderData" class="order-summary-card">
        <img :src="orderData.image" class="summary-img" alt="Lokasi">
        <div class="summary-info">
          <h3>{{ orderData.title }}</h3>
          <p>{{ orderData.location }}</p>
          <p class="summary-date">{{ orderData.date }}</p>
        </div>
      </div>

      <div class="form-card">
        <div class="form-group rating-group">
          <label>Bagaimana pengalaman Anda?</label>
          <div class="stars-container">
            <svg
              v-for="star in 5"
              :key="star"
              @click="setRating(star)"
              :class="['star-icon', { 'filled': star <= rating }]"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          </div>
          <span class="rating-text" v-if="rating > 0">{{ rating }} dari 5 Bintang</span>
        </div>

        <div class="form-group">
          <label for="review">Tulis pendapat Anda</label>
          <textarea
            id="review"
            v-model="comment"
            rows="5"
            placeholder="Ceritakan pengalaman memancing Anda di sini..."
          ></textarea>
        </div>

        <button 
            class="button-submit-review" 
            @click="submitReview" 
            :disabled="submitting || loading"
        >
            {{ submitting ? 'Mengirim...' : 'Kirim Ulasan' }}
        </button>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <div class="success-icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="check-icon">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2>Terima Kasih!</h2>
        <p>Ulasan Anda telah berhasil dikirim.</p>
        <button class="modal-close-btn" @click="closeModal">OK, Kembali</button>
      </div>
    </div>

  </main>
</template>

<style scoped src="./FormUlasanView.style.css"></style>