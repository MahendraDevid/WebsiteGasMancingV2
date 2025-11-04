<script setup>
import { ref } from 'vue';
import './Pesanan.style.css'; 

// Data dummy baru sesuai desain
const allOrders = ref([
  {
    id: 1,
    image: '/img/ancol.png', 
    title: 'Pantai Ancol',
    location: 'Ancol, Jakarta Barat',
    rating: '4.2',
    reviewCount: '300',
    orderDate: '23/10/2025',
    numPeople: 2,
    rentedEquipment: ['Joran Set', 'Umpan'],
    status: 'Lunas', // 'Lunas' atau 'Menunggu Pembayaran'
    statusClass: 'lunas' // Class CSS
  },
  {
    id: 2,
    image: '/img/kolam.png', 
    title: 'Kolam Pemancingan Cibiru',
    location: 'Cibiru, Bandung',
    rating: '4.5',
    reviewCount: '150',
    orderDate: '28/10/2025',
    numPeople: 4,
    rentedEquipment: ['Joran Set x4', 'Umpan Premium', 'Saung'],
    status: 'Menunggu Pembayaran',
    statusClass: 'menunggu'
  },
  {
    id: 3,
    image: '/img/muara.png', 
    title: 'Pemancingan Muara Karang',
    location: 'Pluit, Jakarta Utara',
    rating: '4.7',
    reviewCount: '500',
    orderDate: '15/09/2025',
    numPeople: 1,
    rentedEquipment: ['Tidak ada'],
    status: 'Lunas',
    statusClass: 'lunas'
  },
]);

// Fungsi untuk tombol
function viewDetail(orderId) {
  console.log('Lihat detail untuk:', orderId);
  // router.push(...)
}

function cancelOrder(orderId) {
  console.log('Batalkan pesanan:', orderId);
  alert('Pesanan berhasil dibatalkan.');
}
</script>

<template>
  <main class="pesanan-page-wrapper">
    <h1 class="pesanan-title">Pesanan Saya</h1>

    <!-- Tidak ada lagi Tab Kontrol -->

    <!-- Konten Halaman -->
    <div class="tab-content">
      <section class="order-list">
        
        <!-- Card Baru untuk Pesanan -->
        <div 
          class="order-card" 
          v-for="order in allOrders" 
          :key="order.id"
        >
          <!-- Kiri: Gambar -->
          <div class="card-image-section">
            <img 
              :src="order.image" 
              :alt="order.title" 
              loading="lazy" 
              onerror="this.src='https://placehold.co/600x400/CCCCCC/FFFFFF?text=Error'"
            >
          </div>

          <!-- Kanan: Konten -->
          <div class="card-content-section">
            
            <!-- Status Badge (Kanan Atas) -->
            <div :class="['card-status-badge', order.statusClass]">
              {{ order.status }}
            </div>

            <h3 class="card-title">{{ order.title }}</h3>
            
            <!-- Rating (Tetap ada) -->
            <div class="card-rating">
              <div class="rating-box">
                <img src="/img/star.png" alt="Star">
                <span class="rating-value">{{ order.rating }}</span>
                <span class="review-count">({{ order.reviewCount }})</span>
              </div>
            </div>
            
            <div class="card-location">
              <svg class="location-icon-card" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span>{{ order.location }}</span>
            </div>

            <!-- Info Grid Baru -->
            <div class="card-info-grid">
              <!-- Tanggal -->
              <div class="info-item">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                <span>{{ order.orderDate }}</span>
              </div>
              <!-- Jumlah Orang -->
              <div class="info-item">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span>{{ order.numPeople }} Orang</span>
              </div>
              <!-- Peralatan -->
              <div class="info-item equipment">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16.5 16.5 3.5 3.5L8 22l-1.5-1.5L15 12l-1.5-1.5L2 22l-1.5-1.5L9 12 7.5 10.5 2.5 15.5 1 14l11-11 1.5 1.5L4 14l1.5 1.5L14 7l1.5 1.5L6.5 17 8 18.5l11-11L20.5 9l-3.5 3.5Z"/></svg>
                <span>{{ order.rentedEquipment.join(', ') }}</span>
              </div>
            </div>
            
            <!-- Tombol Aksi -->
            <div class="card-buttons">
              <button class="button-detail" @click="viewDetail(order.id)">Lihat Detail</button>
              <button class="button-cancel" @click="cancelOrder(order.id)">Batalkan</button>
            </div>

          </div>
        </div>
        
        <div v-if="allOrders.length === 0" class="no-orders-message">
          Tidak ada pesanan yang ditemukan.
        </div>
      </section>
    </div>
  </main>
</template>

