<template>
  <div class="place-detail-page">
    <div v-if="loading" class="loading-state">
      <p>Loading...</p>
    </div>

    <div v-else-if="place" class="detail-content">
      <div class="image-header">
        <div class="image-frame">
          <img
            :src="place.image_url"
            :alt="place.title"
            class="place-image"
            @error="handleImageError"
          />
        </div>
        <div class="rating-badge">
          <span>⭐ {{ place.average_rating }} ({{ place.total_reviews_count }})</span>
        </div>
      </div>

      <div class="content-container">
        <div class="main-info">
          <div class="info-text">
            <h1 class="place-name">{{ place.title }}</h1>
            <p class="place-location">{{ place.location }}</p>
          </div>

          <div class="header-booking-box">
            <p class="booking-price-header">Rp. {{ place.base_price }} / {{ place.price_unit }}</p>
            <button class="booking-button" @click.stop="goToBooking">Booking Sekarang</button>
          </div>
        </div>

        <div class="section description-section">
          <h2>Deskripsi:</h2>
          <p class="description-text">{{ place.full_description }}</p>
        </div>
        <hr />

        <div class="section facilities-section">
          <h2>Fasilitas</h2>
          <div class="tag-list">
            <span v-for="(facility, index) in place.fasilitas" :key="index" class="facility-tag">
              {{ facility }}
            </span>
          </div>
        </div>
        <hr />

        <div class="section equipment-section">
          <h2>Peralatan Tambahan:</h2>
          <div class="equipment-grid">
            <div v-for="(item, index) in place.item_sewa" :key="index" class="equipment-card">
              <div class="item-icon">
                <img
                  :src="item.image_url"
                  :alt="item.nama_item"
                  class="equipment-image"
                  @error="handleImageError"
                />
              </div>
              <p class="item-name">{{ item.nama_item }}</p>
              <p class="item-price">Rp. {{ item.price }} / {{ item.price_unit }}</p>
            </div>
          </div>
        </div>

        <hr />

        <div class="section reviews-section">
          <h2>Ulasan Terbaik</h2>
          <div class="reviews-grid">
            <div v-for="(review, index) in place.reviews" :key="index" class="review-card">
              <div class="review-header">
                <div class="avatar-icon"></div>
                <div class="reviewer-info">
                  <p class="reviewer-name">{{ review.reviewer }}</p>
                  <span class="review-rating">⭐ {{ review.score }}/5</span>
                </div>
              </div>
              <p class="review-text">{{ review.comment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="error-state">
      <h2>Tempat tidak ditemukan</h2>
      <p>Maaf, data tempat pemancingan tidak tersedia.</p>
      <button @click="$router.push('/search')" class="back-button">Kembali ke Pencarian</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api' // Pastikan path ini benar

const route = useRoute()
const router = useRouter()

const place = ref(null)
const loading = ref(true)

/**
 * FUNGSI NAVIGASI KE BOOKING (DENGAN SAFEGUARD & DEBUGGING)
 * Menggunakan nama rute 'Booking' dan parameter ':id'.
 */
const goToBooking = () => {
    // ... log panggilan
    
    // GANTI 'id' DENGAN KUNCI PROPERTI YANG BENAR (misal: id_tempat)
    const placeId = place.value?.id || place.value?.id_tempat; // Contoh: Gunakan Optional Chaining

    if (!placeId) {
        console.error('NAVIGASI GAGAL! ID tidak ditemukan pada properti id atau id_tempat.');
        return; 
    }

    // Gunakan ID yang telah divalidasi
    router.push({
      name: 'Booking', 
      params: { id: placeId }, // Gunakan placeId yang baru
      state: { placeData: place.value }
    })
}

const loadPlaceData = async () => {
  try {
    loading.value = true
    const placeId = route.params.id

    // Pastikan ID rute ada sebelum memanggil API
    if (!placeId) {
      console.error('ID tempat tidak ditemukan di rute!')
      place.value = null
      return
    }

    // Call API to get place details
    const response = await api.getPlaceById(placeId)

    if (response.data.success) {
      place.value = response.data.data
      console.log('Data Tempat berhasil dimuat. ID:', place.value.id)
    } else {
      place.value = null
      console.error('Failed to load place data:', response.data.message)
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
