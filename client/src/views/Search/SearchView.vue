<script setup>
defineOptions({ name: 'SearchPage' })

import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import './SearchView.style.css'

const route = useRoute()
const router = useRouter()

// --- 🔗 KONFIGURASI URL GAMBAR (Backend) ---
const API_URL = 'http://localhost:3000/uploads/'

// Fungsi Helper untuk menampilkan gambar
const getImageUrl = (filename) => {
  if (!filename || filename === 'default_place.jpg') {
    return '/img/kolam.png'
  }
  // Cek apakah filename sudah mengandung http (jika misal pakai URL eksternal)
  if (filename.startsWith('http')) return filename

  return `${API_URL}${filename}`
}

// --- SEARCH BAR STATE ---
const searchKeyword = ref(route.query.location || '')
const searchDate = ref(route.query.date || '')
const searchFacilities = ref(route.query.facilities || '')

const searchResults = ref([])
const isLoading = ref(false)

const currentKeywordDisplay = computed(() => {
  return route.query.location || 'Semua Lokasi'
})

const handleSearch = () => {
  router.push({
    query: {
      location: searchKeyword.value.trim() || undefined,
      date: searchDate.value.trim() || undefined,
      facilities: searchFacilities.value.trim() || undefined,
    },
  })
}

// --- FETCH RESULTS ---
const fetchResults = async (query) => {
  isLoading.value = true
  try {
    const params = {}
    for (const key in query) {
      if (query[key]) params[key] = query[key]
    }

    let response
    if (Object.keys(params).length === 0) response = await api.getAllPlaces()
    else response = await api.searchPlaces(params)

    // Handle struktur response
    searchResults.value = response.data.data || response.data
  } catch (error) {
    console.error('Gagal memuat hasil pencarian:', error)
    searchResults.value = []
  } finally {
    isLoading.value = false
  }
}

// Update field & fetch data on URL change
watch(
  () => route.query,
  (query) => {
    searchKeyword.value = query.location || ''
    searchDate.value = query.date || ''
    searchFacilities.value = query.facilities || ''
    fetchResults(query)
  },
  { immediate: true },
)

// --- PAGINATION ---
const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => Math.ceil(searchResults.value.length / itemsPerPage.value))

const paginatedResults = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return searchResults.value.slice(start, start + itemsPerPage.value)
})

watch(searchResults, () => {
  currentPage.value = 1
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const handleBooking = (id) => {
  router.push({
    name: 'DetailTempatPemancing',
    params: { id },
  })
}
</script>

<template>
  <main class="search-page-wrapper">
    <section class="search-section">
      <div class="search-container-custom">
        <div class="search-field-custom">
          <img src="/img/loc.png" class="search-icon" alt="Lokasi" />
          <input
            type="text"
            class="search-input-custom"
            v-model="searchKeyword"
            placeholder="Mau mancing dimana?"
            @keyup.enter="handleSearch"
          />
        </div>

        <div class="search-field-custom">
          <img src="/img/calendar.png" class="search-icon" alt="Tanggal" />
          <input
            class="search-input-custom"
            :type="searchDate ? 'date' : 'text'"
            placeholder="Tanggal Mancing"
            v-model="searchDate"
            @focus="$event.target.type = 'date'"
            @blur="$event.target.type = 'text'"
          />
        </div>

        <div class="search-field-custom">
          <img src="/img/fasilitas.png" class="search-icon" alt="Fasilitas" />
          <input
            type="text"
            class="search-input-custom"
            v-model="searchFacilities"
            placeholder="Fasilitas"
            @keyup.enter="handleSearch"
          />
        </div>

        <button class="search-button-custom" @click="handleSearch">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
            <path
              stroke="currentColor"
              stroke-width="1.5"
              d="m21 21-5.2-5.2A7.5 7.5 0 1 0 5.2 5.2a7.5 7.5 0 0 0 10.6 10.6Z"
            />
          </svg>
        </button>
      </div>
    </section>

    <h2 class="search-results-title">
      Tempat Pemancingan di Sekitar <b>{{ currentKeywordDisplay }}</b>
    </h2>

    <section class="results-container">
      <div v-if="isLoading" class="loading-message">Memuat hasil...</div>

      <div v-else-if="paginatedResults.length">
        <div class="result-card" v-for="item in paginatedResults" :key="item.id_tempat">
          <div class="card-image-section">
            <img
              :src="getImageUrl(item.image_url)"
              :alt="item.title"
              loading="lazy"
              @error="$event.target.src = '/img/kolam.png'"
            />
          </div>

          <div class="card-content-section">
            <h3 class="card-title">{{ item.title }}</h3>

            <div class="card-rating">
              <div class="rating-box">
                <svg width="18" height="18" fill="#FFC107">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 
                    12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                  />
                </svg>
                <span class="rating-value">{{
                  item.average_rating ? Number(item.average_rating).toFixed(1) : 'N/A'
                }}</span>
                <span class="review-count">({{ item.total_reviews_count || 0 }})</span>
              </div>
            </div>

            <div class="card-location">
              <svg class="location-icon-card" width="25" height="25">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{{ item.location }}</span>
            </div>

            <p class="card-description">
              {{ item.description ? item.description.substring(0, 100) + '...' : '' }}
            </p>

            <div class="card-price">
              Rp. {{ item.base_price?.toLocaleString('id-ID') || 0 }}/{{
                item.price_unit || 'Hari'
              }}
            </div>

            <div class="card-button-container">
              <div class="card-facilities">
                <span v-for="(facility, idx) in item.fasilitas" :key="idx" class="facility-tag">
                  {{ facility }}
                </span>
                <span v-if="!item.fasilitas || item.fasilitas.length === 0" class="facility-tag">
                  Fasilitas Standar
                </span>
              </div>

              <div class="card-button-wrapper">
                <button class="button-booking" @click="handleBooking(item.id_tempat)">
                  Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-results-message">
        <h2>Ops, tidak ada hasil untuk "{{ currentKeywordDisplay }}"</h2>
        <p>Coba cari dengan kata kunci lain atau periksa ejaannya.</p>
      </div>
    </section>

    <section v-if="totalPages > 1 && !isLoading" class="pagination-container">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
        Sebelumnya
      </button>

      <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>

      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
        Berikutnya
      </button>
    </section>
  </main>
</template>
