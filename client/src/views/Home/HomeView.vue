<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()

const popularPlaces = ref([])
const tipsList = ref([])
const loadingPlaces = ref(true)
const loadingTips = ref(true)
const searchKeyword = ref('')
const searchPrice = ref('') // Input Harga

// konfigurasi URL gambar dari backend
const API_URL = 'http://localhost:3000/uploads/';

const getImageUrl = (filename) => {
  if (!filename || filename === 'default_place.jpg') {
    return '/img/kolam.png'
  }
  if (filename.startsWith('http')) return filename
  return `${API_URL}${filename}`
}

const loadPopularPlaces = async () => {
  loadingPlaces.value = true
  try {
    const response = await api.getAllPlaces()
    const data = response.data.data || response.data
    if (Array.isArray(data)) {
      popularPlaces.value = data.slice(0, 3)
    }
  } catch (error) {
    console.error('Error load places:', error)
  } finally {
    loadingPlaces.value = false
  }
}

const loadTipsList = async () => {
  loadingTips.value = true
  try {
    const response = await api.getAllEnsiklopedia()
    const data = response.data.data || response.data;

    if (Array.isArray(data)) {
      tipsList.value = data.slice(0, 5)
      await nextTick()
      setTimeout(() => {
        initializeCarousel()
      }, 100)
    }
  } catch (error) {
    console.error('Error load tips:', error)
  } finally {
    loadingTips.value = false
  }
}

const goToSearch = () => {
  router.push({
    name: 'search',
    query: {
      location: searchKeyword.value.trim() || undefined,
      price: searchPrice.value || undefined,
    },
  })
}

const goToMitra = () => router.push({ name: 'mitra-landing' })

function goToDetail(id) {
  router.push({ name: 'DetailTempatPemancing', params: { id } })
}

<<<<<<< HEAD
// --- CAROUSEL LOGIC (START DI TENGAH) ---
=======
const goToEnsiklopedia = (id) => {
  // Mengarah ke halaman ensiklopedia dengan membawa Query Parameter ID
  // Hasil URL nanti: /ensiklopedia?id=1
  router.push({
    name: 'ensiklopedia',
    query: { id: id }
  });
}

// --- Logika Carousel (Tidak Ada Perubahan Signifikan) ---
>>>>>>> 7e2b326fd3d7572b6859b12feeef0f1cc6f6a8c4
const carouselContainer = ref(null)
const isAtStart = ref(false)
const isAtEnd = ref(false)

const initializeCarousel = () => {
  if (!carouselContainer.value) return

  const container = carouselContainer.value
  const cards = container.querySelectorAll('.carousel-card')

  if (cards.length > 0) {
    // 1. Ambil kartu yang ada di urutan tengah
    const middleIndex = Math.floor((cards.length - 1) / 2)
    const targetCard = cards[middleIndex]

    // 2. Hitung posisi scroll agar kartu tersebut pas di tengah layar
    // Rumus: (Posisi Kiri Kartu) - (Setengah Lebar Layar) + (Setengah Lebar Kartu)
    const cardLeft = targetCard.offsetLeft
    const cardWidth = targetCard.offsetWidth
    const containerWidth = container.clientWidth

    const scrollPos = cardLeft - containerWidth / 2 + cardWidth / 2

    // 3. Scroll ke posisi tersebut secara instan
    container.scrollTo({
      left: scrollPos,
      behavior: 'auto',
    })
  }

  // Update visual (besar/kecil)
  updateCarouselState()
}

const scrollCarousel = (direction) => {
  if (!carouselContainer.value) return
  const container = carouselContainer.value
  const card = container.querySelector('.carousel-card')
  // Jika card belum ada, default 300
  const cardWidth = card ? card.clientWidth : 300
  const gap = 20
  const scrollAmount = (cardWidth + gap) * direction

  container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  setTimeout(() => checkArrowState(), 500)
}

const applyCardSizes = () => {
  if (!carouselContainer.value) return
  const container = carouselContainer.value
  const scrollLeft = container.scrollLeft
  const containerWidth = container.clientWidth
  const cards = container.querySelectorAll('.carousel-card')

  cards.forEach((card) => {
    // Titik tengah kartu
    const cardCenter = card.offsetLeft + card.clientWidth / 2
    // Titik tengah layar viewport
    const viewportCenter = scrollLeft + containerWidth / 2

    const distance = Math.abs(cardCenter - viewportCenter)

    card.classList.remove('small', 'medium', 'large')

    // Semakin dekat ke 0 (tengah), semakin besar
    if (distance < containerWidth * 0.15) {
      card.classList.add('large')
    } else if (distance < containerWidth * 0.3) {
      card.classList.add('medium')
    } else {
      card.classList.add('small')
    }
  })
}

const checkArrowState = () => {
  if (!carouselContainer.value) return
  const container = carouselContainer.value
  // Toleransi 10px
  isAtStart.value = container.scrollLeft <= 10
  isAtEnd.value = container.scrollWidth - container.scrollLeft <= container.clientWidth + 10
}

const updateCarouselState = () => {
  applyCardSizes()
  checkArrowState()
}

onMounted(() => {
  loadPopularPlaces()
  loadTipsList()
})
</script>

<template>
  <div class="homepage">
    <main>
      <section class="hero-section">
        <img src="/img/hero-image.jpg" alt="Hero Image" class="hero-image" />
        <div class="shadow-gradient"></div>
        <div class="hero-content">
          <h1 class="hero-title-text">Temukan Spot Pemancingan Terbaik di Indonesia</h1>
        </div>

        <section class="search-section">
          <div class="search-container-custom">
            <div class="search-field-custom">
              <img src="/img/loc.png" alt="Lokasi" class="search-icon" />
              <input type="text" v-model="searchKeyword" class="search-input-custom"
                placeholder="Mau mancing dimana?" />
            </div>
            <div class="search-field-custom">
              <img src="/img/calendar.png" alt="Tanggal" class="search-icon" />
              <input type="text" class="search-input-custom" placeholder="Tanggal Mancing" onfocus="(this.type='date')"
                onblur="(this.type='text')" />
            </div>
            <div class="search-field-custom">
              <img src="/img/fasilitas.png" alt="Fasilitas" class="search-icon" />
              <input type="text" class="search-input-custom" placeholder="Fasilitas" />
            </div>
            <button class="search-button-custom" @click="goToSearch">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" width="28" height="28">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </div>
        </section>
      </section>

      <section class="popular-section">
        <div class="section-title">
          <h2 class="section-title-text">Tempat Pemancingan Populer</h2>
        </div>

        <div v-if="loadingPlaces" class="loading-state">
          <p>Memuat tempat pemancingan...</p>
        </div>
        <div v-else-if="popularPlaces.length === 0" class="empty-state">
          <p>Belum ada tempat pemancingan populer yang tersedia.</p>
        </div>

        <div v-else class="cards-grid">
          <div class="card" v-for="place in popularPlaces" :key="place.id_tempat">
            <img :src="getImageUrl(place.image_url)" :alt="place.title" class="card-image" />
            <span class="card-price-overlay">
<<<<<<< HEAD
              Rp. {{ Number(place.base_price || 0).toLocaleString('id-ID') }}/{{
                place.price_unit || 'Hari'
              }}
=======
              Rp {{ Number(place.base_price || 0).toLocaleString('id-ID') }} / {{ place.price_unit || 'Hari' }}
>>>>>>> 7e2b326fd3d7572b6859b12feeef0f1cc6f6a8c4
            </span>
            <div class="card-content">
              <h3 class="card-title">{{ place.title }}</h3>
              <div class="card-location">
                <span>{{ place.location }}</span>
              </div>
              <div class="card-rating">
                <img src="/img/star.png" alt="Rating" class="rating-star-icon" />
                <span class="rating-score">{{ place.average_rating ? Number(place.average_rating).toFixed(1) : 'N/A'
                  }}</span>
                <span class="rating-count">({{ place.total_reviews_count || 0 }} Ulasan)</span>
              </div>
              <p class="card-description">
                {{ place.description ? place.description.substring(0, 100) + '...' : '' }}
              </p>
              <div class="card-facilities">
                <template v-for="(facility, index) in place.fasilitas" :key="index">
                  <span class="facility" v-if="index < 2">{{ facility }}</span>
                </template>
                <span class="facility-more" v-if="place.fasilitas && place.fasilitas.length > 2"
                  >+{{ place.fasilitas.length - 2 }}</span
                >
              </div>
              <button class="card-button" @click="goToDetail(place.id_tempat)">Lihat Detail</button>
            </div>
          </div>
        </div>
      </section>

      <section class="tips-section">
        <div class="section-title">
          <h2 class="section-title-text">Tips - Tips Memancing</h2>
        </div>
        <div v-if="loadingTips" class="loading-state">
          <p>Memuat artikel ensiklopedia...</p>
        </div>
        <div v-else-if="tipsList.length === 0" class="empty-state">
          <p>Belum ada tips.</p>
        </div>
        <div v-else class="carousel-wrapper">
          <button class="carousel-nav-btn prev" @click="scrollCarousel(-1)" :disabled="isAtStart">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="carousel" ref="carouselContainer" @scroll="updateCarouselState">
            <div class="carousel-card" v-for="tip in tipsList" :key="tip.id_artikel">
              <div class="carousel-card-header">
                <img src="/img/book.png" alt="Tips Icon" class="card-icon" />
                <h3>{{ tip.judul }}</h3>
              </div>
              <p>{{ tip.description ? tip.description.substring(0, 150) + '...' : '' }}</p>
              <a href="#" @click.prevent="goToEnsiklopedia(tip.id_artikel)" class="read-more">
                Baca Selengkapnya &rarr;
              </a>
            </div>
          </div>

          <button class="carousel-nav-btn next" @click="scrollCarousel(1)" :disabled="isAtEnd">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </section>

      <section class="mitra-section">
        <div class="mitra-banner-wrapper">
          <img src="/img/mitra_ad.jpg" alt="Gabung Mitra" class="mitra-image" />
          <div class="mitra-text-overlay">
            <h2>Daftarkan Properti Anda!</h2>
            <p>Bergabunglah menjadi mitra kami dan tingkatkan pendapatan bisnis Anda sekarang.</p>
          </div>
          <button class="mitra-button" @click="goToMitra">Gabung Sekarang</button>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped src="./HomeView.style.css"></style>
