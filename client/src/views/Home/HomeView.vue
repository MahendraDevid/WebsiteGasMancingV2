<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Tambahkan import API Anda
import api from '@/services/api'

const router = useRouter()

// --- 🎣 State untuk Data API ---
const popularPlaces = ref([])
const tipsList = ref([])
const loadingPlaces = ref(true)
const loadingTips = ref(true)

// State untuk input lokasi pencarian (tetap)
const searchKeyword = ref('')

// --- 🌍 Logika Pemanggilan API ---

const loadPopularPlaces = async () => {
  loadingPlaces.value = true
  try {
    // Asumsi API /places mengembalikan semua tempat, dan kita ambil 3-5 teratas (atau yang terbaik)
    const response = await api.getAllPlaces()
    if (response.data.success && Array.isArray(response.data.data)) {
      // Ambil hanya 3 tempat pertama untuk ditampilkan di grid "Populer"
      popularPlaces.value = response.data.data.slice(0, 3)
    } else {
      console.error('Gagal memuat data tempat populer:', response.data.message)
    }
  } catch (error) {
    console.error('Error saat memuat tempat:', error)
  } finally {
    loadingPlaces.value = false
  }
}

const loadTipsList = async () => {
  loadingTips.value = true
  try {
    const response = await api.getAllEnsiklopedia()
    if (response.data.success && Array.isArray(response.data.data)) {
      tipsList.value = response.data.data.slice(0, 5) // Data dimuat

      // >>> PINDAHKAN LOGIKA INIT KE SINI <<<
      await nextTick() // Tunggu DOM selesai diperbarui (Card dirender)
      initializeCarousel() // Panggil fungsi inisialisasi baru
    } else {
      console.error('Gagal memuat data tips/ensiklopedia:', response.data.message)
    }
  } catch (error) {
    console.error('Error saat memuat tips:', error)
  } finally {
    loadingTips.value = false
  }
}

// Fungsi navigasi yang membawa data pencarian
const goToSearch = () => {
  const keyword = searchKeyword.value.trim()

  // Navigasi ke rute /search dan kirim data sebagai query parameter 'location'
  router.push({
    name: 'search', // Pastikan rute ini terdaftar di router/index.js
    query: {
      location: keyword || 'Semua Lokasi',
    },
  })
}

const goToMitra = () => {
  // Navigasi ke rute page kemitraan
  router.push({ name: 'mitra-landing' })
}

function goToDetail(id) {
  router.push({
    name: 'DetailTempatPemancing',
    params: { id }, // Pastikan route detail kamu pakai :id di router/index.js
  })
}

const initializeCarousel = () => {
  if (carouselContainer.value) {
    const container = carouselContainer.value
    const cards = container.querySelectorAll('.carousel-card')

    // Ambil kartu yang berada di posisi tengah (misalnya, index 2 dari 5)
    // Math.floor((cards.length - 1) / 2)
    const middleIndex = Math.floor((cards.length - 1) / 2)
    const targetCard = cards[middleIndex]

    if (targetCard) {
      const cardCenter = targetCard.offsetLeft + targetCard.clientWidth / 2
      const containerCenter = container.clientWidth / 2
      const initialScrollLeft = cardCenter - containerCenter

      container.scrollTo({ left: initialScrollLeft, behavior: 'auto' })
    }

    // ... (Logika lain tetap sama) ...
  }
}

// Data dan Logika Carousel (tetap)
const carouselContainer = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)

const scrollCarousel = (direction) => {
  if (!carouselContainer.value) return

  const container = carouselContainer.value
  const card =
    container.querySelector('.carousel-card.medium') ||
    container.querySelector('.carousel-card.large')
  const cardWidth = card ? card.clientWidth : 320
  const gap = 20
  const scrollAmount = (cardWidth + gap) * direction

  container.scrollBy({
    left: scrollAmount,
    behavior: 'smooth',
  })

  setTimeout(() => {
    checkArrowState()
  }, 500)
}

const applyCardSizes = () => {
  if (!carouselContainer.value) return

  const container = carouselContainer.value
  const scrollLeft = container.scrollLeft
  const containerWidth = container.clientWidth
  const cards = container.querySelectorAll('.carousel-card')

  cards.forEach((card) => {
    const cardCenter = card.offsetLeft + card.clientWidth / 2
    const viewportCenter = scrollLeft + containerWidth / 2
    const distance = Math.abs(cardCenter - viewportCenter)

    if (distance < containerWidth * 0.1) {
      card.classList.remove('small', 'medium')
      card.classList.add('large')
    } else if (distance < containerWidth * 0.25) {
      card.classList.remove('small', 'large')
      card.classList.add('medium')
    } else {
      card.classList.remove('medium', 'large')
      card.classList.add('small')
    }
  })
}

const checkArrowState = () => {
  if (!carouselContainer.value) return

  const container = carouselContainer.value
  const currentScrollLeft = container.scrollLeft
  const maxScrollLeft = container.scrollWidth - container.clientWidth

  isAtStart.value = currentScrollLeft <= 10
  isAtEnd.value = maxScrollLeft - currentScrollLeft <= 10
}

const updateCarouselState = () => {
  applyCardSizes()
  checkArrowState()
}

// --- onMounted: Panggil API saat komponen dimuat ---
onMounted(() => {
  // Panggil kedua fungsi untuk memuat data
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
              <input
                type="text"
                v-model="searchKeyword"
                class="search-input-custom"
                placeholder="Mau mancing dimana?"
              />
            </div>
            <div class="search-field-custom">
              <img src="/img/calendar.png" alt="Tanggal" class="search-icon" />
              <input
                type="text"
                class="search-input-custom"
                placeholder="Tanggal Mancing"
                onfocus="(this.type='date')"
                onblur="(this.type='text')"
              />
            </div>
            <div class="search-field-custom">
              <img src="/img/fasilitas.png" alt="Fasilitas" class="search-icon" />
              <input type="text" class="search-input-custom" placeholder="Fasilitas" />
            </div>
            <button class="search-button-custom" @click="goToSearch">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                width="28"
                height="28"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
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
            <img :src="place.image_url || '/img/kolam.png'" :alt="place.title" class="card-image" />
            <div class="card-content">
              <span class="card-price-overlay">
                Rp. {{ place.base_price.toLocaleString('id-ID') }}/hari
              </span>
              <h3 class="card-title">{{ place.title }}</h3>
              <div class="card-location">
                <span>{{ place.location }}</span>
              </div>
              <div class="card-rating">
                <img src="/img/star.png" alt="Rating" class="rating-star-icon" />
                <span class="rating-score">{{ place.average_rating || 'N/A' }}</span>
                <span class="rating-count">({{ place.total_reviews_count || 0 }} Ulasan)</span>
              </div>
              <p class="card-description">{{ place.description.substring(0, 100) }}...</p>
              <div class="card-facilities">
                <template v-for="(facility, index) in place.fasilitas" :key="index">
                  <span class="facility" v-if="index < 2">
                    {{ facility }}
                  </span>
                </template>

                <span class="facility-more" v-if="place.fasilitas.length > 2">
                  +{{ place.fasilitas.length - 2 }}
                </span>

                <span v-else-if="place.fasilitas.length === 0" class="facility-none">
                  Tidak ada fasilitas terdaftar
                </span>
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
          <p>Belum ada artikel tips yang tersedia.</p>
        </div>

        <div v-else class="carousel-wrapper">
          <button class="carousel-nav-btn prev" @click="scrollCarousel(-1)" :disabled="isAtStart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="carousel" ref="carouselContainer" @scroll="updateCarouselState">
            <div class="carousel-card" v-for="tip in tipsList" :key="tip.id_artikel">
              <div class="carousel-card-header">
                <img src="/img/book.png" alt="Tips Icon" class="card-icon" />
                <h3>{{ tip.title }}</h3>
              </div>
              <p>{{ tip.description }}</p>
              <a :href="`/ensiklopedia?id=${tip.id_artikel}`" class="read-more"
                >Baca Selengkapnya &rarr;</a
              >
            </div>
          </div>

          <button class="carousel-nav-btn next" @click="scrollCarousel(1)" :disabled="isAtEnd">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </section>
      <section class="mitra-section">
        <div class="mitra-banner-wrapper">
          <img src="/img/mitra_ad.jpg" alt="Gabung Mitra Gas Mancing" class="mitra-image" />

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
