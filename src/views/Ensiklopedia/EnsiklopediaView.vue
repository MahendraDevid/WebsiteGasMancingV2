<script setup>
import { ref, computed } from 'vue'
// 1. Impor komponen FishCard yang baru
import FishCard from '@/components/CardEnsiklopedia.vue'

// 2. State untuk bilah pencarian
const searchQuery = ref('')

// 3. Data ikan (seperti sebelumnya)
const items = ref([
  { id: 1, title: 'Ikan Nila', description: 'Ikan air tawar...', image: '/img/fish.png' },
  { id: 2, title: 'Ikan Mas', description: 'Ikan air tawar...', image: '/img/fishs.png' },
  { id: 3, title: 'Ikan Lele', description: 'Ikan air tawar...', image: '/img/fishss.png' },
  { id: 4, title: 'Ikan Patin', description: 'Ikan air tawar...', image: '/img/fishsss.png' },
  { id: 5, title: 'Ikan Bawal', description: 'Ikan air tawar...', image: '/img/fishssss.png' },
  { id: 6, title: 'Ikan Gurame', description: 'Ikan air tawar...', image: '/img/fishsssss.png' },
  { id: 7, title: 'Ikan Mujair', description: 'Ikan air tawar...', image: '/img/fishssssss.png' },
  { id: 8, title: 'Ikan Angjay', description: 'Ikan air tawar...', image: '/img/fishsssssss.png' },
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
</script>

<template>
  <div class="ensiklopedia-view">
    <div class="header-section">
      <h1 class="page-title">Ensiklopedia Ikan</h1>
      <p class="page-subtitle">Pelajari berbagai jenis ikan untuk pengalaman mancing yang lebih baik</p>

      <!-- 
        5. TAMBAHKAN SEARCH BAR 
        Sesuai dengan desain Anda
      -->
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
      6. Gunakan komponen FishCard 
      dan loop data yang sudah difilter 
    -->
    <div class="grid-container">
      <FishCard 
        v-for="item in filteredItems" 
        :key="item.id" 
        :fish="item" 
      />
    </div>

    <!-- Tampilkan pesan jika hasil pencarian kosong -->
    <div v-if="filteredItems.length === 0" class="no-results">
      <h3>Oops!</h3>
      <p>Ikan dengan nama "{{ searchQuery }}" tidak ditemukan.</p>
    </div>
  </div>
</template>

<style scoped src="./EnsiklopediaView.style.css"></style>
