<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Import API service
import api from '@/services/api';
// Import style (as requested by user's file structure)
import './PesananView.style.css';

const router = useRouter();
const route = useRoute();

// State untuk menyimpan data pesanan dari API
const allOrders = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
const cancelMessage = ref('');
const showCancelModal = ref(false);
const orderToCancel = ref(null);
const isLoggedIn = ref(false); // State baru untuk cek login

// Fungsi untuk format tanggal (contoh sederhana)
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Format ke DD/MM/YYYY
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return dateString; // Fallback jika gagal parse
  }
};

// Fungsi untuk mengambil data pesanan dari API
async function fetchOrders() {
  isLoading.value = true;
  errorMessage.value = null;

  // 1. Cek status login lokal
  const token = localStorage.getItem('token');
  if (!token) {
    isLoggedIn.value = false;
    isLoading.value = false;
    errorMessage.value = 'Anda harus login untuk melihat daftar pesanan Anda.';
    return; // Hentikan proses fetch jika tidak ada token
  }

  isLoggedIn.value = true;

  try {
    // 2. Panggil API (token sudah disertakan di interceptor)
    const response = await api.getAllPesananByUserId();

    // Asumsi data dari backend memiliki struktur yang diperlukan
    const mapStatus = (status) => {
      if (!status) return 'menunggu';
      switch (status.toLowerCase()) {
        case 'lunas':
        case 'selesai':
        case 'paid':
          return 'lunas';
        case 'menunggu_pembayaran':
        case 'pending':
          return 'menunggu';
        case 'dibatalkan':
        case 'cancelled':
          return 'dibatalkan';
        default:
          return 'menunggu';
      }
    };

    allOrders.value = response.data.data.map(order => ({
      id: order.id,
      image: order.place_image || 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=No+Image',
      title: order.place_name || 'Tempat Pemancingan',
      location: order.place_location || 'Lokasi Tidak Diketahui',
      rating: order.place_rating || 'N/A',
      reviewCount: order.place_review_count || '0',
      orderDate: formatDate(order.tanggal_mulai), // Gunakan tanggal mulai sebagai referensi
      numPeople: order.jumlah_orang || 1,
      rentedEquipment: (order.items || []).length > 0 ?
        order.items.map(item => `${item.name} x${item.quantity}`).join(', ') :
        'Tidak ada',
      status: order.status || 'Menunggu Pembayaran',
      statusClass: mapStatus(order.status)
    }));

  } catch (error) {
    console.error('Gagal mengambil pesanan:', error);
    // Jika backend menolak (e.g., 401 Unauthorized karena token kadaluarsa/invalid)
    if (error.response && error.response.status === 401) {
      errorMessage.value = 'Sesi Anda telah berakhir atau Anda belum login. Mohon login kembali.';
      isLoggedIn.value = false;
    } else {
      errorMessage.value = 'Gagal memuat daftar pesanan. Silakan coba lagi.';
    }
  } finally {
    isLoading.value = false;
  }
}

// Panggil fetchOrders saat komponen dimuat
onMounted(() => {
  fetchOrders();
});

// Fungsi navigasi
function goToDetailPesanan(orderId) {
  router.push({ name: 'detailpesanan', params: { orderId } });
}

function goToUlasan(orderId) {
  router.push({ name: 'formulasan', params: { orderId } });
}

// ===================================
// Logika Pembatalan
// ===================================

function openCancelModal(order) {
  // Hanya izinkan pembatalan jika statusnya menunggu pembayaran
  if (order.statusClass === 'menunggu') {
    orderToCancel.value = order;
    showCancelModal.value = true;
  } else {
    cancelMessage.value = `Pesanan ${order.id} tidak dapat dibatalkan karena statusnya sudah ${order.status}.`;
    console.warn(cancelMessage.value);
  }
}

async function confirmCancel() {
  showCancelModal.value = false;
  if (!orderToCancel.value) return;

  const orderId = orderToCancel.value.id;
  cancelMessage.value = '';

  try {
    // Panggil API untuk membatalkan
    await api.cancelPesanan(orderId);
    cancelMessage.value = `Pesanan ID ${orderId} berhasil dibatalkan.`;
    console.log(cancelMessage.value);

    // Perbarui daftar pesanan setelah pembatalan
    await fetchOrders();

  } catch (error) {
    const errorDetail = error.response?.data?.message || 'Terjadi kesalahan saat membatalkan.';
    cancelMessage.value = `Pembatalan pesanan ID ${orderId} gagal: ${errorDetail}`;
    console.error(cancelMessage.value);
  } finally {
    orderToCancel.value = null;
  }
}

function closeCancelModal() {
  showCancelModal.value = false;
  orderToCancel.value = null;
}
</script>

<template>
  <main class="pesanan-page-wrapper">
    <h1 class="pesanan-title">Pesanan Saya</h1>

    <!-- Loading State -->
    <div v-if="isLoading && isLoggedIn" class="loading-message">
      <div class="spinner"></div>
      Memuat pesanan...
    </div>

    <!-- Error/Not Logged In State -->
    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
      <!-- Tambahkan link/tombol untuk login jika belum login -->
      <div v-if="!isLoggedIn" class="mt-4">
        <button class="button-detail" @click="router.push({ name: 'profile' })">
          Masuk/Daftar Sekarang
        </button>
      </div>
    </div>

    <!-- Cancel Confirmation Modal (Custom UI Pengganti Alert) -->
    <div v-if="showCancelModal" class="custom-modal-backdrop">
      <div class="custom-modal">
        <h3 class="modal-title">Konfirmasi Pembatalan</h3>
        <p>Apakah Anda yakin ingin membatalkan pesanan ini (ID: {{ orderToCancel?.id }})?</p>
        <div class="modal-actions">
          <button class="button-detail" @click="confirmCancel">Ya, Batalkan</button>
          <button class="button-cancel red-style" @click="closeCancelModal">Tidak, Kembali</button>
        </div>
      </div>
    </div>

    <!-- Success/Failure Message -->
    <div v-if="cancelMessage" :class="['message-box', cancelMessage.includes('gagal') ? 'error' : 'success']">
      {{ cancelMessage }}
      <button class="close-btn" @click="cancelMessage = ''">X</button>
    </div>

    <!-- Order List Content -->
    <div v-else-if="!isLoading && isLoggedIn" class="tab-content">
      <section class="order-list">
        <div class="order-card" v-for="order in allOrders" :key="order.id">

          <div class="card-image-section">
            <img :src="order.image" :alt="order.title" loading="lazy"
              onerror="this.src='https://placehold.co/600x400/CCCCCC/FFFFFF?text=Error'">
          </div>

          <div class="card-content-section">
            <div :class="['card-status-badge', order.statusClass]">
              {{ order.status }}
            </div>

            <h3 class="card-title">{{ order.title }}</h3>

            <div class="card-rating">
              <div class="rating-box">
                <img src="/img/star.png" alt="Star">
                <span class="rating-value">{{ order.rating }}</span>
                <span class="review-count">({{ order.reviewCount }})</span>
              </div>
            </div>

            <div class="card-location">
              <svg class="location-icon-card" xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{{ order.location }}</span>
            </div>

            <div class="card-info-grid">
              <div class="info-item">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{{ order.orderDate }}</span>
              </div>
              <div class="info-item">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>{{ order.numPeople }} Orang</span>
              </div>
              <div class="info-item equipment">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="m16.5 16.5 3.5 3.5L8 22l-1.5-1.5L15 12l-1.5-1.5L2 22l-1.5-1.5L9 12 7.5 10.5 2.5 15.5 1 14l11-11 1.5 1.5L4 14l1.5 1.5L14 7l1.5 1.5L6.5 17 8 18.5l11-11L20.5 9l-3.5 3.5Z" />
                </svg>
                <span>{{ order.rentedEquipment }}</span>
              </div>
            </div>

            <div class="card-buttons">
              <div class="buttons-row">
                <button class="button-detail" @click="goToDetailPesanan(order.id)">Lihat Detail</button>
                <button class="button-cancel red-style" :disabled="order.statusClass !== 'menunggu'"
                  @click="openCancelModal(order)">
                  Batalkan
                </button>
              </div>

              <button v-if="order.statusClass === 'lunas'" class="button-review" @click="goToUlasan(order.id)">
                Beri Ulasan
              </button>
            </div>

          </div>
        </div>

        <div v-if="allOrders.length === 0" class="no-orders-message">
          Anda belum memiliki pesanan aktif.
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
/* Inline CSS untuk styling komponen ini, termasuk modal, status, dan loading */

.pesanan-page-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', sans-serif;
}

.pesanan-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0d47a1;
  /* Darker blue primary color */
  margin-bottom: 25px;
  text-align: center;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  display: flex;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s;
}

.order-card:hover {
  transform: translateY(-3px);
}

.card-image-section {
  width: 30%;
  min-width: 120px;
  overflow: hidden;
}

.card-image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.card-content-section {
  padding: 20px;
  width: 70%;
  position: relative;
}

.card-status-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.card-status-badge.lunas {
  background-color: #4caf50;
  /* Green */
}

.card-status-badge.menunggu {
  background-color: #ff9800;
  /* Orange */
}

.card-status-badge.dibatalkan {
  background-color: #f44336;
  /* Red */
}

.card-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 5px;
  color: #212121;
}

.card-rating {
  margin-bottom: 10px;
}

.rating-box {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.95rem;
  color: #757575;
}

.rating-box img {
  width: 16px;
  height: 16px;
}

.rating-value {
  font-weight: 600;
  color: #424242;
}

.card-location {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  color: #616161;
  margin-bottom: 15px;
}

.location-icon-card {
  width: 18px;
  height: 18px;
  color: #424242;
}

.card-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #424242;
}

.info-icon {
  width: 18px;
  height: 18px;
  color: #1976d2;
  /* Blue accent */
}

.info-item.equipment {
  grid-column: span 2;
}

.card-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.buttons-row {
  display: flex;
  gap: 10px;
}

.card-buttons button {
  padding: 10px 15px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;
  font-size: 0.9rem;
}

.button-detail {
  flex-grow: 1;
  background-color: #1976d2;
  /* Primary Blue */
  color: white;
}

.button-detail:hover {
  background-color: #1565c0;
}

.button-cancel {
  background-color: #e0e0e0;
  color: #333;
}

.button-cancel.red-style {
  background-color: #ef5350;
  /* Light Red */
  color: white;
}

.button-cancel.red-style:hover {
  background-color: #d32f2f;
}

.button-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


.button-review {
  background-color: #66bb6a;
  /* Light Green for action */
  color: white;
  width: 100%;
}

.button-review:hover {
  background-color: #43a047;
}


/* Responsive Design */
@media (max-width: 600px) {
  .pesanan-title {
    font-size: 2rem;
  }

  .order-card {
    flex-direction: column;
  }

  .card-image-section {
    width: 100%;
    height: 200px;
  }

  .card-content-section {
    width: 100%;
  }

  .card-info-grid {
    grid-template-columns: 1fr;
  }

  .info-item.equipment {
    grid-column: span 1;
  }

  .buttons-row {
    flex-direction: column;
  }
}

/* Loading Spinner */
.loading-message,
.no-orders-message,
.error-message {
  text-align: center;
  padding: 40px 20px;
  font-size: 1.1rem;
  color: #555;
  background-color: #f7f7f7;
  border-radius: 12px;
  margin-top: 20px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Custom Modal Styling (Pengganti Alert) */
.custom-modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.custom-modal {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal-title {
  color: #1976d2;
  margin-top: 0;
  font-size: 1.5rem;
}

.modal-actions {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  justify-content: center;
}

/* Success/Failure Message Box */
.message-box {
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.message-box.success {
  background-color: #e8f5e9;
  /* Light green */
  color: #2e7d32;
  /* Dark green text */
  border: 1px solid #a5d6a7;
}

.message-box.error {
  background-color: #ffebee;
  /* Light red */
  color: #c62828;
  /* Dark red text */
  border: 1px solid #ef9a9a;
}

.close-btn {
  background: none;
  border: none;
  color: inherit;
  font-weight: bold;
  cursor: pointer;
}

/* Style untuk tombol login di pesan error */
.mt-4 {
  margin-top: 1rem;
}
</style>