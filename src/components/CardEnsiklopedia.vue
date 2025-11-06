<template>
  <div class="card">
    <div class="card-image">
      <img :src="fish.image" :alt="fish.title" @error="handleImageError">
    </div>
    <div class="card-content">
      <h3 class="card-title">{{ fish.title }}</h3>
      <p class="card-description">{{ fish.description }}</p>
      <button class="btn-detail">Lihat Detail</button>
    </div>
  </div>
</template>

<script setup>
// 1. Kita simpan 'defineProps' ke dalam variabel 'props'
//    agar bisa diakses oleh fungsi di bawah.
const props = defineProps({
  fish: {
    type: Object,
    required: true
  }
})

// 2. Fungsi fallback image sekarang DINAMIS
const handleImageError = (event) => {
  // Ambil title dari props, beri fallback 'Gambar' jika title kosong
  const title = props.fish.title || 'Gambar'
  
  // Gunakan title tersebut di URL placeholder.
  // encodeURIComponent() penting untuk menangani spasi (misal: "Ikan Nila")
  event.target.src = `https://placehold.co/300x200/608BC1/ffffff?text=${encodeURIComponent(title)}`
}
</script>

<style scoped>
/* CSS Anda dari sebelumnya sudah sempurna, tidak perlu diubah */
.card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 12px;
  background-color: #ffffff;
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 24px;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}
.card-image {
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: #e9ecef;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.card:hover .card-image img {
  transform: scale(1.1);
}
.card-content {
  padding: 8px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.card-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--bay-of-many);
  margin-bottom: 14px;
}
.card-description {
  font-size: 15px;
  color: #6c757d;
  line-height: 1.7;
  margin-bottom: 20px;
  flex: 1;
}
.btn-detail {
  width: 100%;
  padding: 12px 24px;
  background-color: var(--btn-blue);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-detail:hover {
  background-color: #4f7aa8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>