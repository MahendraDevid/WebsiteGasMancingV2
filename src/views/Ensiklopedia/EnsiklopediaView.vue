<script setup>
import { ref, computed } from 'vue'
// 1. Impor komponen DataEnsiklopedia yang baru
import DataEnsiklopedia from '@/components/CardEnsiklopedia.vue'
import DetailEnsiklopedia from '@/components/DetailEnsiklopedia.vue'

// 2. State untuk bilah pencarian
const searchQuery = ref('')
const isModalVisible = ref(false)
const selectedItem = ref(null)

// 3. Data ikan (seperti sebelumnya)
const items = ref([
  {
    id: 1,
    title: 'Ikan Gabus',
    description: `Tips Memancing Ikan Gabus:
    1. Gunakan umpan hidup seperti katak atau ikan kecil.
    2. Pilih waktu pagi atau sore hari.
     1. Gunakan umpan hidup seperti katak atau ikan kecil.
    2. Pilih waktu pagi atau sore hari.`,
    image: '/img/fish.png',
    media: [
      { type: 'image', url: '/img/fishs.png' },
      { type: 'video', url: 'https://www.youtube.com/embed/KA2-caMdYlM?si=nUxTHNJbOO3qrBzt' },
      { type: 'image', url: '/img/fishs.png' },
      { type: 'image', url: '/img/gabus3.jpg' },
      { type: 'image', url: '/img/gabus4.jpg' }
    ],
    details: `Tips Memancing Ikan Gabus:
    1. Gunakan umpan hidup seperti katak atau ikan kecil.
    2. Pilih waktu pagi atau sore hari.

    Cara Memancing Ikan Gabus:
    1. Gunakan joran medium-heavy.
    2. Gunakan reel kuat.
    3. Tarik perlahan agar ikan terpancing keluar dari sarangnya.
    
    1. Gunakan umpan hidup seperti katak atau ikan kecil.
    2. Pilih waktu pagi atau sore hari.

    Cara Memancing Ikan Gabus:
    1. Gunakan joran medium-heavy.
    2. Gunakan reel kuat.
    3. Tarik perlahan agar ikan terpancing keluar dari sarangnya.
    
        1. Gunakan umpan hidup seperti katak atau ikan kecil.
    2. Pilih waktu pagi atau sore hari.

    Cara Memancing Ikan Gabus:
    1. Gunakan joran medium-heavy.
    2. Gunakan reel kuat.
    3. Tarik perlahan agar ikan terpancing keluar dari sarangnya.`
  },
  { id: 2, title: 'Ikan Mas', description: 'Ikan air tawar...', image: '/img/fishs.png' },
  { id: 3, title: 'Ikan Lele', description: 'Ikan air tawar...', image: '/img/fishss.png' },
  { id: 4, title: 'Ikan Patin', description: 'Ikan air tawar...', image: '/img/fishsss.png' },
  { id: 5, title: 'Ikan Bawal', description: 'Ikan air tawar...', image: '/img/fishssss.png' },
  { id: 6, title: 'Ikan Gurame', description: 'Ikan air tawar...', image: '/img/fishsssss.png' },
  { id: 7, title: 'Ikan Mujair', description: 'Ikan air tawar...', image: '/img/fishssssss.png' },
  { id: 8, title: 'Ikan Angjay', description: 'Ikan air tawar...', image: '/img/fishsssssss.png' },
  { id: 9, title: 'Ikan Bawal', description: 'Ikan air tawar...', image: '/img/fishssss.png' },
  { id: 10, title: 'Ikan Gurame', description: 'Ikan air tawar...', image: '/img/fishsssss.png' },
  { id: 11, title: 'Ikan Mujair', description: 'Ikan air tawar...', image: '/img/fishssssss.png' },
  { id: 12, title: 'Ikan Angjay', description: 'Ikan air tawar...', image: '/img/fishsssssss.png' },
  { id: 13, title: 'Ikan Bawal', description: 'Ikan air tawar...', image: '/img/fishssss.png' },
  { id: 14, title: 'Ikan Gurame', description: 'Ikan air tawar...', image: '/img/fishsssss.png' },
  { id: 15, title: 'Ikan Mujair', description: 'Ikan air tawar...', image: '/img/fishssssss.png' },
  { id: 16, title: 'Ikan Angjay', description: 'Ikan air tawar...', image: '/img/fishsssssss.png' },
])

// 4. Logika filter pencarian (Computed Property)
const filteredItems = computed(() => {
  // Jika pencarian kosong, tampilkan semua
  if (!searchQuery.value) {
    return items.value
  }
  // Jika tidak, filter berdasarkan judul
  const query = searchQuery.value.toLowerCase()
  return items.value.filter(item => 
    item.title.toLowerCase().includes(query)
  )
})


const itemsPerPage = 12 // 3 baris × 4 kolom
const currentPage = ref(1)

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredItems.value.slice(start, end)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// buka & tutup modal
const openModal = (item) => {
  selectedItem.value = item
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
  selectedItem.value = null
}
</script>

<template>
  <div class="ensiklopedia-view">
    <div class="header-section">
      <h1 class="page-title">Ensiklopedia Memancing</h1>
      <p class="page-subtitle">Pelajari berbagai Teknik Memancing untuk pengalaman mancing yang lebih baik</p>


      <div class="search-container">
        <input 
          type="text" 
          class="search-input" 
          placeholder="Cari ikan (contoh: Nila, Lele, Gabus...)"
          v-model="searchQuery"
        />
        <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>

    <!-- 
      6. Gunakan komponen DataEnsiklopedia 
      dan loop data yang sudah difilter 
    -->
    <div class="grid-container">
      <DataEnsiklopedia 
        v-for="item in paginatedItems" 
        :key="item.id" 
        :data="item" 
        @show-detail="openModal"
      />
    </div>

    <div v-if="totalPages > 1" class="pagination">
      <button 
        class="page-btn"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        ‹
      </button>

      <button 
        v-for="page in totalPages" 
        :key="page" 
        class="page-btn"
        :class="{ active: currentPage === page }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button 
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        ›
      </button>
    </div>


    <!-- Tampilkan pesan jika hasil pencarian kosong -->
    <div v-if="filteredItems.length === 0" class="no-results">
      <h3>Oops!</h3>
      <p>Ikan dengan nama "{{ searchQuery }}" tidak ditemukan.</p>
    </div>

        <!-- Modal Detail -->
    <DetailEnsiklopedia
      v-if="selectedItem"
      :isVisible="isModalVisible"
      :item="selectedItem"
      @close="closeModal"
    />
  </div>
</template>

<style scoped src="./EnsiklopediaView.style.css"></style>
