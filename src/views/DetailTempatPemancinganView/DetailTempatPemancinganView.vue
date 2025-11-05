<template>
  <div class="place-detail-page">
    
    <div v-if="place" class="detail-content">
      <div class="image-header">
        <img :src="place.image" :alt="place.title" class="place-image" />
        <div class="rating-badge">
          <span>⭐ {{ place.rating }} ({{ place.totalReviews }})</span>
        </div>
      </div>

      <div class="content-container">
        <div class="main-info">
          <!-- Info Kiri (Judul & Lokasi) -->
          <div class="info-text">
            <h1 class="place-name">{{ place.title }}</h1>
            <p class="place-location">{{ place.location }}</p>
          </div>
          
          <!-- Tombol Booking Header -->
          <div class="header-booking-box">
            <p class="booking-price-header">{{ place.price }}</p>
            <button class="booking-button">
              <a href="/booking">Booking Sekarang</a>
            </button>
          </div>
        </div>
        <div class="section description-section">
          <h2>Deskripsi:</h2>
          <p class="description-text">{{ place.fullDescription }}</p>
        </div>
        <hr>
        <div class="section facilities-section">
          <h2>Fasilitas</h2>
          <div class="tag-list">
            <span 
              v-for="(facility, index) in place.facilities" 
              :key="index" 
              class="facility-tag"
            >
              {{ facility }}
            </span>
          </div>
        </div>
        <hr>
        <div class="section equipment-section">
          <h2>Peralatan Tambahan:</h2>
          <div class="equipment-grid">
            <div 
              v-for="(item, index) in place.equipment" 
              :key="index" 
              class="equipment-card"
            >
              <div class="item-icon">
                🎣
              </div>
              <p class="item-name">{{ item.name }}</p>
              <p class="item-price">{{ item.price }}</p>
            </div>
          </div>
        </div>
        
        <hr>

        <div class="section reviews-section">
          <h2>Ulasan Terbaik</h2>
          <div class="reviews-grid">
            <div 
              v-for="(review, index) in place.reviews" 
              :key="index" 
              class="review-card"
            >
              <div class="review-header">
                <div class="avatar-icon"></div>
                <div class="reviewer-info">
                  <p class="reviewer-name">{{ review.name }}</p>
                  <span class="review-rating">⭐ {{ review.score }}/5</span>
                </div>
              </div>
              <p class="review-text">{{ review.comment }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Loading atau Error State -->
    <div v-else class="error-state">
      <h2>Tempat tidak ditemukan</h2>
      <p>Maaf, data tempat pemancingan tidak tersedia.</p>
      <button @click="$router.push('/search')" class="back-button">
        Kembali ke Pencarian
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute} from 'vue-router'
// Pastikan placesData memiliki properti 'price', contoh: "Rp 50.000 / orang"
import { placesData } from '@/data/placesData' 

const route = useRoute()

// State untuk data tempat
const place = ref(null)

// Fungsi untuk load data berdasarkan ID dari URL
const loadPlaceData = () => {
  const placeId = parseInt(route.params.id)
  
  // Cari data tempat berdasarkan ID
  const foundPlace = placesData.find(p => p.id === placeId)
  
  if (foundPlace) {
    place.value = foundPlace
  } else {
    place.value = null
    console.error('Tempat tidak ditemukan dengan ID:', placeId)
  }
}

// Load data saat component mounted
onMounted(() => {
  loadPlaceData()
})
</script>

<!-- Semua style sekarang ada di file .css -->
<style scoped src="./DetailTempatPemancinganView.style.css"></style>