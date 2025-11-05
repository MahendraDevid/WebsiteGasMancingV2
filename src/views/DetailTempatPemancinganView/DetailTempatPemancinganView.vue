<template>
  <div class="place-detail-page">
    
    <div class="image-header">
      <img src="/img/ancol.png" :alt="place.name" class="place-image" />
      <div class="rating-badge">
        <span>⭐ {{ place.rating }} ({{ place.totalReviews }})</span>
      </div>
    </div>

    <div class="content-container">
      <div class="main-info">
        <h1 class="place-name">{{ place.name }}</h1>
        <p class="place-location">{{ place.location }}</p>
      </div>

      <div class="section description-section">
        <h2>Deskripsi:</h2>
        <p class="description-text">{{ place.description }}</p>
      </div>
      
      <div class="section facilities-section">
        <h2>Fasilitas</h2>
        <div class="tag-list">
          <span 
            v-for="facility in place.facilities" 
            :key="facility" 
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

[Image of fishing equipment]
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
</template>

<script setup>
import { ref } from 'vue';

// --- DATA PLACEHOLDER ---
const place = ref({
  name: 'Pantai Ancol',
  location: 'Ancol, Jakarta barat',
  rating: 4.2,
  totalReviews: 900,
  description: 
    "Bayangkan sebuah spot memancing di laut lepas dengan latar belakang silhouette megah Jakarta skyline yang berdiri gagah di kejauhan. Dari atas kapal atau dermaga, para pemancing dapat menyaksikan gedung-gedung pencakar langit yang berkilauan ditimpa cahaya matahari sore, menciptakan pemandangan kontras antara kehidupan perkotaan yang sibuk dengan ketenangan laut biru yang membentang luas.",
  facilities: ['Toilet', 'Kantin', 'Kantin', 'Parkir', 'Musholla'],
  equipment: [
    { name: 'Pancingan', price: 'Rp. 25.000 / item' },
    { name: 'Pancingan', price: 'Rp. 25.000 / item' },
    { name: 'Pancingan', price: 'Rp. 25.000 / item' },
    { name: 'Pancingan', price: 'Rp. 25.000 / item' },
    { name: 'Pancingan', price: 'Rp. 25.000 / item' },
    { name: 'Pancingan', price: 'Rp. 25.000 / item' },
    { name: 'Pancingan', price: 'Rp. 25.000 / item' },
    { name: 'Pancingan', price: 'Rp. 25.000 / item' },
  ],
  reviews: [
    { name: 'Bambang Pamungkas', score: 4, comment: 'Aplikasi ini benar-benar membantu banget buat saya yang hobi mancing. Informasi yang disajikan sangat lengkap, mulai dari cuaca laut, sampai tipe peralatan semua ada. Jadi, ga perlu bingung lagi deh, jadi gampang dipakai waktu lagi di kapal.' },
    { name: 'Bambang Pamungkas', score: 4, comment: 'Aplikasi ini benar-benar membantu banget buat saya yang hobi mancing. Informasi yang disajikan sangat lengkap, mulai dari cuaca laut, sampai tipe peralatan semua ada. Jadi, ga perlu bingung lagi deh, jadi gampang dipakai waktu lagi di kapal.' },
    { name: 'Bambang Pamungkas', score: 4, comment: 'Aplikasi ini benar-benar membantu banget buat saya yang hobi mancing. Informasi yang disajikan sangat lengkap, mulai dari cuaca laut, sampai tipe peralatan semua ada. Jadi, ga perlu bingung lagi deh, jadi gampang dipakai waktu lagi di kapal.' },
  ]
});
</script>

<style scoped src="./DetailTempatPemancinganView.style.css"></style>