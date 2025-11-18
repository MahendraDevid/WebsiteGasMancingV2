<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataEnsiklopedia from '@/components/CardEnsiklopedia.vue'
import DetailEnsiklopedia from '@/components/DetailEnsiklopedia.vue'

// --- State Utama ---
const searchQuery = ref('')
const isModalVisible = ref(false)
const selectedItem = ref(null)
const route = useRoute()
const router = useRouter()

// --- Data Ensiklopedia ---
const items = ref([
  {
    id: 1,
    title: 'Ikan Gabus',
    description: `Tips Memancing Ikan Gabus:
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
    3. Tarik perlahan agar ikan terpancing keluar dari sarangnya.`
  },

  {
    id: 20,
    title: 'Teknik Memancing',
    description: `Kumpulan Teknik Memancing yang Efektif:
    1. Teknik Casting — melempar dan menggulung umpan secara berulang untuk menarik ikan predator.
    2. Teknik Dasaran — menggunakan pemberat agar umpan berada di dasar air, cocok untuk lele dan patin.
    3. Teknik Fly Fishing — menggunakan umpan ringan menyerupai serangga.
    4. Teknik Trolling — menarik umpan di belakang perahu.
    5. Teknik Pelampung — mudah dipelajari untuk pemula.`,
    image: '/img/produk1.png',
    media: [
      { type: 'image', url: '/img/produk1.png' },
      { type: 'video', url: 'https://www.youtube.com/embed/Uvg0R0kPGYM' },
      { type: 'image', url: '/img/produk1.png' },
      { type: 'image', url: '/img/produk1.png' },
      { type: 'image', url: '/img/produk1.png' }
    ],
    details: `🎣 Teknik Memancing Lengkap Untuk Semua Kondisi

1. Teknik Casting
   - Gunakan umpan buatan (lure) seperti minnow atau spoon.
   - Lempar ke area yang dicurigai ada ikan, lalu gulung perlahan agar gerakannya alami.
   - Efektif untuk ikan predator seperti gabus, toman, dan barramundi.

2. Teknik Dasaran
   - Gunakan pemberat timah di ujung tali agar umpan jatuh ke dasar air.
   - Cocok untuk ikan dasar seperti lele, patin, dan baung.

3. Teknik Fly Fishing
   - Menggunakan umpan tiruan menyerupai serangga.
   - Cocok di sungai dangkal atau air jernih dengan arus ringan.

4. Teknik Trolling
   - Tarik umpan di belakang perahu yang bergerak pelan.
   - Digunakan untuk ikan laut besar seperti tenggiri, marlin, atau tuna.

5. Teknik Pancing Pelampung
   - Gunakan pelampung untuk mengatur kedalaman umpan.
   - Mudah untuk pemula dan cocok di kolam atau sungai tenang.

💡 *Tips Tambahan:*
- Gunakan teknik berbeda sesuai kondisi air dan jenis ikan.
- Perhatikan cuaca dan waktu (pagi/sore biasanya lebih produktif).
- Selalu rawat peralatan setelah digunakan agar awet.`
  },
   {
    id: 30,
    title: 'Umpan Terbaik',
    description: `Kumpulan umpan paling ampuh untuk berbagai jenis ikan.`,
    image: '/img/umpan.jpg',
    media: [
      { type: 'image', url: '/img/umpan1.jpg' },
      { type: 'video', url: 'https://www.youtube.com/embed/H6hErwPTKGo' },
      { type: 'image', url: '/img/umpan2.jpg' },
      { type: 'image', url: '/img/umpan3.jpg' }
    ],
    details: `🎣 Umpan Terbaik Untuk Berbagai Ikan

1. Ikan Lele — Gunakan umpan cacing tanah, usus ayam, atau ikan kecil.
2. Ikan Gabus — Katak hidup atau tiruan berbentuk serangga.
3. Ikan Mas — Adonan roti, pelet, dan essen vanili.
4. Ikan Patin — Pelet dicampur keju atau telur bebek.
5. Ikan Bawal — Umpan daging atau pelet amis.

💡 *Tips:*  
Gunakan umpan sesuai habitat ikan dan waktu memancing (pagi/sore hari).`
  },

  // 🎣 ID 40 — Pancingan Terbaik
  {
    id: 40,
    title: 'Pancingan Terbaik',
    description: `Rekomendasi pancing dan perlengkapan untuk hasil maksimal.`,
    image: '/img/pancingan.jpg',
    media: [
      { type: 'image', url: '/img/pancing1.jpg' },
      { type: 'video', url: 'https://www.youtube.com/embed/o5jIGxZzJ9Q' },
      { type: 'image', url: '/img/pancing2.jpg' }
    ],
    details: `🏆 Pancingan Terbaik untuk Berbagai Kondisi

1. Joran Spinning — fleksibel dan cocok untuk pemula.
2. Reel Baitcasting — presisi tinggi untuk teknik casting.
3. Senar PE — kuat, tahan gesekan, cocok untuk ikan besar.
4. Kail karbon — ringan tapi tajam, ideal untuk berbagai umpan.
5. Aksesori — gunakan swivel dan stopper untuk efisiensi.

💡 *Tips:*  
Sesuaikan pancingan dengan lokasi dan target ikanmu.`
  },

  // 🐟 ID 50 — Jenis Ikan
  {
    id: 50,
    title: 'Jenis Ikan',
    description: `Mengenal berbagai jenis ikan air tawar dan laut.`,
    image: '/img/jenisikan.jpg',
    media: [
      { type: 'image', url: '/img/ikanair.jpg' },
      { type: 'image', url: '/img/ikanlaut.jpg' },
      { type: 'video', url: 'https://www.youtube.com/embed/hvR1hGQkKq8' }
    ],
    details: `🐠 Jenis-Jenis Ikan Populer di Indonesia

1. Ikan Air Tawar
   - Lele, Gabus, Patin, Mas, Gurame.
2. Ikan Air Payau
   - Bandeng, Kakap Merah.
3. Ikan Laut
   - Tuna, Cakalang, Tenggiri, Kerapu.

💡 *Fakta Menarik:*  
Setiap jenis ikan memiliki kebiasaan makan dan habitat berbeda — pahami sebelum memancing!`
  },

  // --- Data Ikan Lain ---
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

// --- Filter Pencarian ---
const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter(i => i.title.toLowerCase().includes(q))
})

// --- Pagination ---
const itemsPerPage = 12
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredItems.value.slice(start, start + itemsPerPage)
})
const goToPage = (p) => { if (p >= 1 && p <= totalPages.value) currentPage.value = p }

// --- Modal ---
const openModal = (item) => {
  selectedItem.value = item
  isModalVisible.value = true
}
const closeModal = () => {
  isModalVisible.value = false
  selectedItem.value = null
}

// --- Auto Buka Modal Jika Ada ?id=... di URL ---
onMounted(() => {
  const id = parseInt(route.query.id)
  if (id) {
    const found = items.value.find(i => i.id === id)
    if (found) {
      openModal(found)
    }
  }
})
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
