<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const place = ref(null)
const loading = ref(true)

// konfigurasi URL gambar backend
const API_URL = 'http://localhost:3000/uploads/'

// Fungsi Helper untuk menampilkan gambar
const getImageUrl = (filename) => {
  if (!filename || filename === 'default_place.jpg') {
    return '/img/kolam.png'
  }
  if (filename.startsWith('http')) return filename

  return `${API_URL}${filename}`
}

const goToBooking = () => {
  const placeId = place.value?.id || place.value?.id_tempat;

  if (!placeId) {
    console.error('NAVIGASI GAGAL! ID tidak ditemukan.');
    return;
  }

  router.push({
    name: 'Booking',
    params: { id: placeId },
    state: { placeData: place.value }
  })
}

const loadPlaceData = async () => {
  try {
    loading.value = true
    const placeId = route.params.id

    if (!placeId) {
      console.error('ID tempat tidak ditemukan di rute!')
      place.value = null
      return
    }

    const response = await api.getPlaceById(placeId)

    if (response.data.success) {
      place.value = response.data.data
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
  event.target.src = '/img/placeholder.png'
}

onMounted(() => {
  loadPlaceData()
})
</script>

<template>
  <div class="place-detail-page">
    <div v-if="loading" class="loading-state">
      <p>Loading...</p>
    </div>

    <div v-else-if="place" class="detail-content">
      <div class="image-header">
        <div class="image-frame">
          <img :src="getImageUrl(place.image_url)" :alt="place.title" loading="lazy"
            @error="$event.target.src = '/img/kolam.png'" />
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
            <p class="booking-price-header">Rp. {{ place.base_price?.toLocaleString('id-ID') }} / {{ place.price_unit }}
            </p>
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
                <img :src="getImageUrl(item.image_url)" :alt="item.nama_item" class="equipment-image"
                  @error="handleImageError" />
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

<style scoped src="./DetailTempatPemancinganView.style.css"></style>