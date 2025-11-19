<template>
  <div class="place-detail-page">
    
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <p>Loading...</p>
    </div>

    <!-- Place Data -->
    <div v-else-if="place" class="detail-content">
      <div class="image-header">
        <div class="image-frame">
          <img :src="place.image" :alt="place.title" class="place-image" @error="handleImageError" />
        </div>
        <div class="rating-badge">
          <span>⭐ {{ place.rating }} ({{ place.total_reviews }})</span>
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
            <button class="booking-button" @click="goToBooking">
              Booking Sekarang
            </button>
          </div>
        </div>

        <div class="section description-section">
          <h2>Deskripsi:</h2>
          <p class="description-text">{{ place.full_description }}</p>
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
                <img 
                  :src="item.image" 
                  :alt="item.name"
                  class="equipment-image"
                  @error="handleImageError"
                />
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

    <!-- Error State -->
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
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const place = ref(null)
const loading = ref(true)

const goToBooking = () => {
  // Pass place data to booking page
  router.push({
    name: 'booking',
    params: { placeId: place.value.id },
    state: { place: place.value }
  })
}

const loadPlaceData = async () => {
  try {
    loading.value = true
    const placeId = route.params.id
    
    // Call API to get place details
    const response = await api.getPlaceById(placeId)
    
    if (response.data.success) {
      place.value = response.data.data
    } else {
      place.value = null
      console.error('Failed to load place data')
    }
  } catch (error) {
    console.error('Error loading place:', error)
    place.value = null
  } finally {
    loading.value = false
  }
}

const handleImageError = (event) => {
  event.target.src = '/img/placeholder.png' // Fallback image
}

onMounted(() => {
  loadPlaceData()
})
</script>

<style scoped src="./DetailTempatPemancinganView.style.css"></style>