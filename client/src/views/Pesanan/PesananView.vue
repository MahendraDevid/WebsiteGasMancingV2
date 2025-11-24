<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import './PesananView.style.css';

const router = useRouter();
const authStore = useAuthStore();

// --- 🔗 KONFIGURASI URL GAMBAR (Backend) ---
const API_URL = 'http://localhost:3000/uploads/'; 

// Fungsi Helper untuk menampilkan gambar
const getImageUrl = (filename) => {
  if (!filename || filename === 'default_place.jpg') {
    return 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=No+Image'; 
  }
  // Cek apakah filename sudah mengandung http
  if (filename.startsWith('http')) return filename;
  
  return `${API_URL}${filename}`;
}

// State
const allOrders = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
const cancelMessage = ref('');
const showCancelModal = ref(false);
const orderToCancel = ref(null);

// Format tanggal
const formatDate = (dateString) => {
  if (!dateString || dateString === '0000-00-00') return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

// Fetch pesanan dari API
async function fetchOrders() {
  isLoading.value = true;
  errorMessage.value = null;

  if (!authStore.isAuthenticated) {
    isLoading.value = false;
    errorMessage.value = 'Anda harus login untuk melihat daftar pesanan Anda.';
    return;
  }

  try {
    const response = await api.getAllPesananByUserId();

    const mapStatus = (status) => {
      if (!status) return 'menunggu';
      const statusLower = status.toLowerCase();

      if (statusLower === 'lunas' || statusLower === 'selesai') {
        return 'lunas';
      } else if (statusLower.includes('menunggu')) {
        return 'menunggu';
      } else if (statusLower === 'dibatalkan') {
        return 'dibatalkan';
      }
      return 'menunggu';
    };

    allOrders.value = response.data.data.map(order => ({
      id: order.id_pesanan,
      nomorPesanan: order.nomor_pesanan || '-',
      
      // PERBAIKAN DI SINI: Gunakan getImageUrl
      // Pastikan backend mengirim field 'place_image'
      image: getImageUrl(order.place_image), 
      
      title: order.place_name || 'Tempat Pemancingan',
      location: order.place_location || 'Lokasi Tidak Diketahui',
      rating: Number(order.place_rating) || 0,
      reviewCount: Number(order.place_review_count) || 0,
      orderDate: formatDate(order.tanggal_mulai),
      numPeople: order.jumlah_orang || 1,
      durasiJam: order.durasi_jam || 0,
      rentedEquipment: (order.items || []).length > 0
        ? order.items.map(item => `${item.name} x${item.quantity}`).join(', ')
        : 'Tidak ada',
      status: order.status || 'Menunggu Pembayaran',
      statusClass: mapStatus(order.status),
      totalBiaya: order.total_harga || 0
    }));

  } catch (error) {
    console.error('Gagal mengambil pesanan:', error);

    if (error.response?.status === 401) {
      errorMessage.value = 'Sesi Anda telah berakhir. Mohon login kembali.';
      authStore.logout();
    } else {
      errorMessage.value = error.response?.data?.error || 'Gagal memuat daftar pesanan. Silakan coba lagi.';
    }
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchOrders();
});

function goToDetailPesanan(orderId) {
  router.push({ name: 'detailpesanan', params: { orderId } });
}

function goToUlasan(orderId) {
  router.push({ name: 'formulasan', params: { orderId } });
}

function openCancelModal(order) {
  if (order.statusClass === 'menunggu') {
    orderToCancel.value = order;
    showCancelModal.value = true;
  } else {
    cancelMessage.value = `Pesanan ${order.nomorPesanan} tidak dapat dibatalkan karena statusnya sudah ${order.status}.`;
  }
}

async function confirmCancel() {
  showCancelModal.value = false;
  if (!orderToCancel.value) return;

  const orderId = orderToCancel.value.id;
  cancelMessage.value = '';

  try {
    const response = await api.cancelPesanan(orderId);

    if (response.data.success) {
      cancelMessage.value = `Pesanan ${orderToCancel.value.nomorPesanan} berhasil dibatalkan.`;
      await fetchOrders();
    }
  } catch (error) {
    const errorDetail = error.response?.data?.error || 'Terjadi kesalahan saat membatalkan.';
    cancelMessage.value = `Pembatalan pesanan gagal: ${errorDetail}`;
    console.error(cancelMessage.value);
  } finally {
    orderToCancel.value = null;
  }
}

function closeCancelModal() {
  showCancelModal.value = false;
  orderToCancel.value = null;
}

function goToLogin() {
  router.push({ name: 'login', query: { redirect: '/pesanan' } });
}
</script>

<template>
  <main class="pesanan-page-wrapper">
    <h1 class="pesanan-title">Pesanan Saya</h1>

    <div v-if="isLoading" class="loading-message">
      <div class="spinner"></div>
      Memuat pesanan...
    </div>

    <div v-else-if="errorMessage" class="error-message">
      {{ errorMessage }}
      <div v-if="!authStore.isAuthenticated" class="mt-4">
        <button class="button-detail" @click="goToLogin">
          Login Sekarang
        </button>
      </div>
    </div>

    <div v-if="showCancelModal" class="custom-modal-backdrop">
      <div class="custom-modal">
        <h3 class="modal-title">Konfirmasi Pembatalan</h3>
        <p>Apakah Anda yakin ingin membatalkan pesanan <strong>{{ orderToCancel?.nomorPesanan }}</strong>?</p>
        <div class="modal-actions">
          <button class="button-detail" @click="confirmCancel">Ya, Batalkan</button>
          <button class="button-cancel red-style" @click="closeCancelModal">Tidak, Kembali</button>
        </div>
      </div>
    </div>

    <div v-if="cancelMessage" :class="['message-box', cancelMessage.includes('gagal') ? 'error' : 'success']">
      {{ cancelMessage }}
      <button class="close-btn" @click="cancelMessage = ''">✕</button>
    </div>

    <div v-else-if="!isLoading && authStore.isAuthenticated" class="tab-content">
      <section class="order-list">

        <div v-if="allOrders.length === 0" class="no-orders-message">
          <p>Anda belum memiliki pesanan aktif.</p>
          <button class="button-detail" @click="router.push('/search')">
            Cari Tempat Pemancingan
          </button>
        </div>

        <div v-else class="order-card" v-for="order in allOrders" :key="order.id">

          <div class="card-image-section">
            <img 
                :src="order.image" 
                :alt="order.title" 
                loading="lazy"
                @error="$event.target.src = 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=No+Image'"
            >
          </div>

          <div class="card-content-section">
            <div :class="['card-status-badge', order.statusClass]">
              {{ order.status }}
            </div>

            <p class="order-number">No. Pesanan: <strong>{{ order.nomorPesanan }}</strong></p>

            <h3 class="card-title">{{ order.title }}</h3>

            <div class="card-rating">
              <div class="rating-box">
                <span class="star">⭐</span>
                <span class="rating-value">{{ Number(order.rating).toFixed(1) }}</span>
                <span class="review-count">({{ order.reviewCount }})</span>
              </div>
            </div>

            <div class="card-location">
              <svg class="location-icon-card" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{{ order.location }}</span>
            </div>

            <div class="card-info-grid">
              <div class="info-item">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>{{ order.orderDate }}</span>
              </div>

              <div class="info-item">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{{ order.durasiJam }} Jam</span>
              </div>

              <div class="info-item">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span>{{ order.numPeople }} Orang</span>
              </div>

              <div class="info-item equipment">
                <svg class="info-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                </svg>
                <span>{{ order.rentedEquipment }}</span>
              </div>
            </div>

            <div class="total-price">
              <strong>Total: Rp {{ order.totalBiaya.toLocaleString('id-ID') }}</strong>
            </div>

            <div class="card-buttons">
              <div class="buttons-row">
                <button class="button-detail" @click="goToDetailPesanan(order.id)">
                  Lihat Detail
                </button>
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
      </section>
    </div>
  </main>
</template>

<style scoped>
/* CSS ANDA SUDAH BAGUS, SAYA PERTAHANKAN */
.pesanan-page-wrapper { max-width: 1000px; margin: 0 auto; padding: 20px; font-family: 'Inter', -apple-system, sans-serif; }
.pesanan-title { font-size: 2.5rem; font-weight: 700; color: #0d47a1; margin-bottom: 30px; text-align: center; }
.order-list { display: flex; flex-direction: column; gap: 20px; }
.order-card { display: flex; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; }
.order-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); }
.card-image-section { width: 250px; min-width: 250px; overflow: hidden; }
.card-image-section img { width: 100%; height: 100%; object-fit: cover; }
.card-content-section { flex: 1; padding: 20px; position: relative; }
.card-status-badge { position: absolute; top: 15px; right: 15px; padding: 6px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: white; text-transform: uppercase; }
.card-status-badge.lunas { background-color: #4caf50; }
.card-status-badge.menunggu { background-color: #ff9800; }
.card-status-badge.dibatalkan { background-color: #f44336; }
.order-number { font-size: 0.85rem; color: #666; margin-bottom: 8px; }
.card-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 10px 0; color: #212121; padding-right: 120px; }
.card-rating { margin-bottom: 10px; }
.rating-box { display: flex; align-items: center; gap: 5px; }
.star { font-size: 16px; }
.rating-value { font-weight: 600; color: #424242; }
.review-count { color: #757575; font-size: 0.9rem; }
.card-location { display: flex; align-items: center; gap: 6px; color: #616161; margin-bottom: 15px; font-size: 0.9rem; }
.location-icon-card { color: #1976d2; }
.card-info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 15px; }
.info-item { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #424242; }
.info-item.equipment { grid-column: span 3; }
.info-icon { color: #1976d2; flex-shrink: 0; }
.total-price { font-size: 1.1rem; color: #1976d2; margin-bottom: 15px; }
.card-buttons { display: flex; flex-direction: column; gap: 10px; }
.buttons-row { display: flex; gap: 10px; }
.card-buttons button { padding: 10px 16px; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
.button-detail { flex: 1; background-color: #1976d2; color: white; }
.button-detail:hover { background-color: #1565c0; }
.button-cancel { background-color: #e0e0e0; color: #333; }
.button-cancel.red-style { background-color: #ef5350; color: white; }
.button-cancel.red-style:hover:not(:disabled) { background-color: #d32f2f; }
.button-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
.button-review { background-color: #66bb6a; color: white; }
.button-review:hover { background-color: #43a047; }
.loading-message, .no-orders-message, .error-message { text-align: center; padding: 60px 20px; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); }
.spinner { border: 4px solid rgba(25, 118, 210, 0.1); border-top: 4px solid #1976d2; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 15px; }
@keyframes spin { to { transform: rotate(360deg); } }
.custom-modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.custom-modal { background: white; padding: 30px; border-radius: 12px; max-width: 400px; width: 90%; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2); }
.modal-title { color: #1976d2; margin: 0 0 15px 0; font-size: 1.5rem; }
.modal-actions { margin-top: 25px; display: flex; gap: 10px; }
.message-box { padding: 15px 20px; border-radius: 8px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
.message-box.success { background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; }
.message-box.error { background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; }
.close-btn { background: none; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; padding: 0 5px; }
.mt-4 { margin-top: 20px; }
@media (max-width: 768px) {
  .pesanan-title { font-size: 2rem; }
  .order-card { flex-direction: column; }
  .card-image-section { width: 100%; height: 200px; }
  .card-title { padding-right: 100px; }
  .card-info-grid { grid-template-columns: 1fr 1fr; }
  .info-item.equipment { grid-column: span 2; }
  .buttons-row { flex-direction: column; }
}
</style>