<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataEnsiklopedia from '@/components/CardEnsiklopedia.vue'
import DetailEnsiklopedia from '@/components/DetailEnsiklopedia.vue'
import api from '@/services/api'

// --- State Utama ---
const searchQuery = ref('')
const isModalVisible = ref(false)
const selectedItem = ref(null)
const route = useRoute()
const router = useRouter()

// --- State Data Dinamis ---
const items = ref([]) // Data akan diisi dari API
const isLoading = ref(true) // Status loading
const error = ref(null) // Status error

// --- 1. Fetch Data dari API ---
const fetchEnsiklopedia = async () => {
  isLoading.value = true
  error.value = null
  try {
    // Panggil endpoint API Anda
    const response = await api.getAllEnsiklopedia()

    // Asumsi: Data Ensiklopedia ada di response.data.data
    // Model di backend sudah memastikan setiap item memiliki 'media' array dan 'details'.
    items.value = response.data.data

  } catch (err) {
    console.error('Gagal memuat Ensiklopedia:', err)
    error.value = 'Gagal memuat data Ensiklopedia. Pastikan backend server aktif dan terkoneksi ke database.'
  } finally {
    isLoading.value = false
  }
}

// --- Filter Pencarian (Client-Side) ---
const filteredItems = computed(() => {
  // Jika ada error atau masih loading, kembalikan array kosong
  if (isLoading.value || error.value) return []

  if (!searchQuery.value) return items.value
  const q = searchQuery.value.toLowerCase()

  // Filter berdasarkan judul atau deskripsi (disesuaikan dengan data dari DB)
  return items.value.filter(i =>
    i.title.toLowerCase().includes(q) ||
    i.description.toLowerCase().includes(q)
  )
})

// Reset halaman ke-1 saat pencarian berubah
watch(searchQuery, () => {
  currentPage.value = 1
})

// --- 2. Pagination Dinamis ---
const itemsPerPage = 12
const currentPage = ref(1)
// Menghitung total halaman berdasarkan filteredItems (data dari API)
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredItems.value.slice(start, start + itemsPerPage)
})

const goToPage = (p) => {
  if (p >= 1 && p <= totalPages.value) currentPage.value = p
}


// --- Modal ---
const openModal = (item) => {
  selectedItem.value = item
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
  selectedItem.value = null
}

// --- Logic Auto Buka Modal (On Mounted) ---
onMounted(() => {
  fetchEnsiklopedia() // Panggil data pertama kali

  // Watch items changes for auto-open modal (karena data dimuat asynchronously)
  watch(items, (newItems) => {
    const id = parseInt(route.query.id)
    if (id && newItems.length > 0) {
      const found = newItems.find(i => i.id === id)
      if (found) {
        openModal(found)
      }
    }
  }, { immediate: true }) // Jalankan segera saat data dimuat
})
</script>

<template>
  <div class="ensiklopedia-view">
    <div class="header-section">
      <h1 class="page-title">Ensiklopedia Memancing</h1>
      <p class="page-subtitle">Pelajari berbagai Teknik Memancing untuk pengalaman mancing yang lebih baik</p>

      <div class="search-container">
        <input type="text" class="search-input" placeholder="Cari ikan (contoh: Nila, Lele, Gabus...)"
          v-model="searchQuery" />
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <div v-if="isLoading" class="loading-state">
      <p>Memuat Ensiklopedia...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p class="error-message">{{ error }}</p>
      <button @click="fetchEnsiklopedia" class="retry-btn">Coba Lagi</button>
    </div>

    <div v-else class="content-wrapper">
      <div class="grid-container">
        <DataEnsiklopedia v-for="item in paginatedItems" :key="item.id" :data="item" @show-detail="openModal" />
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button class="page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
          ‹
        </button>

        <button v-for="page in totalPages" :key="page" class="page-btn" :class="{ active: currentPage === page }"
          @click="goToPage(page)">
          {{ page }}
        </button>

        <button class="page-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
          ›
        </button>
      </div>

      <div v-if="filteredItems.length === 0 && items.length > 0" class="no-results">
        <h3>Oops!</h3>
        <p>Artikel dengan kata kunci "{{ searchQuery }}" tidak ditemukan.</p>
        <p>Coba kata kunci lain atau periksa ejaan.</p>
      </div>

      <div v-if="items.length === 0 && !isLoading && !error" class="no-results">
        <h3>Data Kosong</h3>
        <p>Belum ada artikel Ensiklopedia yang tersedia di database saat ini.</p>
      </div>
    </div>

    <DetailEnsiklopedia v-if="selectedItem" :isVisible="isModalVisible" :item="selectedItem" @close="closeModal" />
  </div>
</template>

<style scoped src="./EnsiklopediaView.style.css"></style>