<script setup>
import { ref } from 'vue'

const items = ref([
  { 
    id: 1, 
    title: 'Ikan Nila',
    description: 'Ikan air tawar yang populer untuk dipancing. Mudah ditemukan di danau dan sungai.',
    image: '/img/ikan-nila.jpg'
  },
  { 
    id: 2, 
    title: 'Ikan Mas',
    description: 'Ikan air tawar yang banyak dibudidayakan. Sangat cocok untuk pemancing pemula.',
    image: '/img/ikan-mas.jpg'
  },
  { 
    id: 3, 
    title: 'Ikan Lele',
    description: 'Ikan air tawar yang aktif di malam hari. Memiliki kumis sebagai ciri khasnya.',
    image: '/img/ikan-lele.jpg'
  },
  { 
    id: 4, 
    title: 'Ikan Patin',
    description: 'Ikan air tawar dengan daging yang lembut. Sering ditemukan di sungai besar.',
    image: '/img/ikan-patin.jpg'
  },
  { 
    id: 5, 
    title: 'Ikan Bawal',
    description: 'Ikan dengan bentuk pipih yang populer. Dapat ditemukan di air tawar dan laut.',
    image: '/img/ikan-bawal.jpg'
  },
  { 
    id: 6, 
    title: 'Ikan Gurame',
    description: 'Ikan air tawar berukuran besar. Merupakan ikan favorit untuk acara mancing keluarga.',
    image: '/img/ikan-gurame.jpg'
  },
  { 
    id: 7, 
    title: 'Ikan Mujair',
    description: 'Ikan air tawar yang mudah berkembang biak. Sering dijumpai di kolam dan waduk.',
    image: '/img/ikan-mujair.jpg'
  },
  { 
    id: 8, 
    title: 'Ikan Gabus',
    description: 'Ikan predator air tawar yang kuat. Dikenal sebagai ikan yang menantang untuk dipancing.',
    image: '/img/ikan-gabus.jpg'
  },
])
</script>

<template>
  <div class="ensiklopedia-view">
    <div class="header-section">
      <h1 class="page-title">Ensiklopedia Ikan</h1>
      <p class="page-subtitle">Pelajari berbagai jenis ikan untuk pengalaman mancing yang lebih baik</p>
    </div>

    <div class="grid-container">
      <div v-for="item in items" :key="item.id" class="card">
        <div class="card-image">
          <img :src="item.image" :alt="item.title" @error="handleImageError">
        </div>
        <div class="card-content">
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-description">{{ item.description }}</p>
          <button class="btn-detail">Lihat Detail</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handleImageError(event) {
      // Fallback image if image fails to load
      event.target.src = 'https://via.placeholder.com/300x200/608BC1/ffffff?text=Ikan'
    }
  }
}
</script>

<style scoped src="@/assets/styles/ensiklopedia.css"></style>
