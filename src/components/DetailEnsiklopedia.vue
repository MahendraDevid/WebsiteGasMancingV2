<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <button class="close-button" @click="closeModal">&times;</button>

      <div class="media-box">
        
        <!-- Slider Track: Bagian yang bergerak -->
        <div class="slider-track" :style="trackStyle">
          <!-- Loop semua media (video/gambar) -->
          <div 
            v-for="(media, index) in item.media" 
            :key="index" 
            class="slide"
          >
            <template v-if="media.type === 'video'">
              <iframe 
                :src="media.url" 
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
              </iframe>
            </template>
            <template v-else>
              <img :src="media.url" :alt="item.title" @error="handleImageError" />
            </template>
          </div>
        </div>

        <!-- Navigasi Slider (Panah) -->
        <button class="slider-nav prev" @click="prevSlide">&#10094;</button>
        <button class="slider-nav next" @click="nextSlide">&#10095;</button>

        <!-- Dots Indikator -->
        <div class="slider-dots">
          <span 
            v-for="(media, index) in item.media" 
            :key="index"
            class="dot"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
          ></span>
        </div>

      </div>

      <div class="content-box">
        <h2 class="content-title">{{ item.title || 'Judul Ensiklopedia' }}</h2>
        <p class="content-description" v-html="item.details"></p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  item: {
    type: Object,
    default: () => ({ media: [], details: 'Tidak ada detail.' }) // Pastikan 'media' adalah array
  }
})

const emit = defineEmits(['close'])

// --- LOGIKA CAROUSEL ---
const currentSlide = ref(0)
const slideInterval = ref(null)

// Computed property untuk menggerakkan track
const trackStyle = computed(() => ({
  transform: `translateX(-${currentSlide.value * 100}%)`
}))

const nextSlide = () => {
  const newIndex = (currentSlide.value + 1) % (props.item.media?.length || 1)
  currentSlide.value = newIndex
  resetAutoPlay()
}

const prevSlide = () => {
  const newIndex = (currentSlide.value - 1 + (props.item.media?.length || 1)) % (props.item.media?.length || 1)
  currentSlide.value = newIndex
  resetAutoPlay()
}

const goToSlide = (index) => {
  currentSlide.value = index
  resetAutoPlay()
}

// Fungsi untuk auto-play (5 detik)
const startAutoPlay = () => {
  stopAutoPlay() // Hentikan dulu jika ada
  slideInterval.value = setInterval(() => {
    nextSlide()
  }, 5000) // 5000ms = 5 detik
}

const stopAutoPlay = () => {
  clearInterval(slideInterval.value)
}

const resetAutoPlay = () => {
  stopAutoPlay()
  startAutoPlay()
}

// Saat modal dibuka (mounted), mulai auto-play
onMounted(() => {
  currentSlide.value = 0 // Selalu mulai dari slide pertama
  if (props.item.media && props.item.media.length > 1) {
    startAutoPlay()
  }
})

// Saat modal ditutup (unmounted), hentikan auto-play
onBeforeUnmount(() => {
  stopAutoPlay()
})

// --- LOGIKA MODAL ---
const closeModal = () => {
  emit('close')
}

// Fallback jika gambar gagal dimuat
const handleImageError = (event) => {
  const title = props.item.title || 'Media'
  event.target.src = `https://placehold.co/600x450/1e1e1e/ffffff?text=${encodeURIComponent(title)}`
}
</script>

<style scoped>
/* === Overlay & Container === */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1100px;
  height: 90vh;
  max-height: 700px;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: row;
}

/* === Close Button === */
.close-button {
  position: absolute;
  top: 15px;
  right: 20px;
  background: transparent;
  border: none;
  color: #999; 
  font-size: 36px;
  cursor: pointer;
  z-index: 1060; /* Di atas segalanya */
  line-height: 1;
}
.close-button:hover {
  color: #000;
}

/* === Kolom Kiri: Media Box (Carousel) === */
.media-box {
  flex: 1.5;
  background: #1e1e1e;
  position: relative; /* Diperlukan untuk tombol navigasi */
  overflow: hidden; /* Sembunyikan slide yang tidak aktif */
}

.slider-track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.slide {
  flex-shrink: 0;
  width: 100%;
  height: 100%;
}

.slide iframe,
.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: none;
}

/* Navigasi (Panah) */
.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  z-index: 1051;
  transition: background-color 0.2s;
}
.slider-nav:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
.slider-nav.prev {
  left: 10px;
}
.slider-nav.next {
  right: 10px;
}

/* Dots Indikator */
.slider-dots {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 1051;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.2s;
}
.dot:hover {
  background-color: rgba(255, 255, 255, 0.8);
}
.dot.active {
  background-color: white;
}


/* === Kolom Kanan: Content Box (Scrollable) === */
.content-box {
  flex: 1;
  padding: 40px;
  /* KUNCI UNTUK SCROLL: */
  overflow-y: auto; 
  position: relative;
}

.content-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--bay-of-many, #133e87);
  margin-bottom: 20px;
  padding-right: 40px;
}

.content-description {
  font-size: 16px;
  color: #333;
  white-space: pre-wrap; 
  line-height: 1.7;
}

/* === Responsive === */
@media (max-width: 768px) {
  .modal-container {
    flex-direction: column;
    height: 90vh;
    max-height: 800px;
  }
  .media-box {
    flex: 1;
    min-height: 250px;
  }
  .content-box {
    flex: 1;
    padding: 25px;
  }
  .close-button {
  
    color: white;
    top: 10px;
    right: 15px;
  }
}
</style>