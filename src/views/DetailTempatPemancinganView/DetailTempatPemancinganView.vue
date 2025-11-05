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
          <h1 class="place-name">{{ place.title }}</h1>
          <p class="place-location">{{ place.location }}</p>
        </div>

        <div class="section description-section">
          <h2>Deskripsi:</h2>
          <p class="description-text">{{ place.fullDescription }}</p>
        </div>
        
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

<style scoped src="./DetailTempatPemancinganView.style.css"></style>

<style scoped>
/* Additional styles untuk error state */
.error-state {
  text-align: center;
  padding: 60px 20px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.error-state h2 {
  font-size: 28px;
  color: #e74c3c;
  margin-bottom: 15px;
}

.error-state p {
  font-size: 16px;
  color: #7f8c8d;
  margin-bottom: 30px;
}

.back-button {
  padding: 12px 30px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}
</style>