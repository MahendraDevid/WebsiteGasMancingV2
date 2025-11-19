<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import './FormUlasanView.style.css';

const router = useRouter();
const route = useRoute();
const orderId = route.params.orderId;

// State Form
const rating = ref(0);
const comment = ref('');
const orderData = ref(null);

// State Modal
const showSuccessModal = ref(false);

onMounted(() => {
  // Dummy data untuk simulasi
  orderData.value = {
    id: orderId,
    title: 'Pantai Ancol',
    location: 'Ancol, Jakarta Barat',
    image: '/img/ancol.png',
    date: '23/10/2025'
  };
});

const setRating = (star) => {
  rating.value = star;
};

const submitReview = () => {
  if (rating.value === 0) {
    alert("Mohon berikan bintang terlebih dahulu.");
    return;
  }

  console.log({
    orderId: orderId,
    rating: rating.value,
    comment: comment.value
  });

  // Munculkan Modal Ceklis
  showSuccessModal.value = true;
};

const closeModal = () => {
  showSuccessModal.value = false;
  router.push({ name: 'pesanan' }); // Redirect ke pesanan
};
</script>

<template>
  <main class="ulasan-page-wrapper">
    <div class="ulasan-container">
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

        <button class="button-submit-review" @click="submitReview">Kirim Ulasan</button>
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
