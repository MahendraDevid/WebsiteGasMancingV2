<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import './PesananView.style.css';

const router = useRouter();
const authStore = useAuthStore();

// konfigurasi URL gambar (backend)
const API_URL = 'http://localhost:3000/uploads/';

// Fungsi Helper untuk menampilkan gambar
const getImageUrl = (filename) => {
  if (!filename || filename === 'default_place.jpg') {
    return '/img/kolam.png'
  }
  if (filename.startsWith('http')) return filename

  return `${API_URL}${filename}`
}

// State
const allOrders = ref([]);
const isLoading = ref(true);
const errorMessage = ref(null);
const cancelMessage = ref('');
const showCancelModal = ref(false);
const orderToCancel = ref(null);

// Auto-hide message after 5 seconds
watch(cancelMessage, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      cancelMessage.value = '';
    }, 5000); // Hide after 5 seconds
  }
});

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
        <p>Apakah Anda yakin ingin membatalkan pesanan <br /><strong>{{ orderToCancel?.nomorPesanan }}</strong>?</p>
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

    <!-- Order List Content -->
    <div v-if="!isLoading && authStore.isAuthenticated" class="tab-content">
      <section class="order-list">

        <div v-if="allOrders.length === 0" class="no-orders-message">
          <p>Anda belum memiliki pesanan aktif.</p>
          <button class="button-detail" @click="router.push('/search')">
            Cari Tempat Pemancingan
          </button>
        </div>

        <div v-else class="order-card" v-for="order in allOrders" :key="order.id">

          <div class="card-image-section">
            <img :src="order.image" :alt="order.title" loading="lazy"
              @error="$event.target.src = 'https://placehold.co/600x400/CCCCCC/FFFFFF?text=No+Image'">
          </div>

          <div class="card-content-section">
            <div :class="['card-status-badge', order.statusClass]">
              {{ order.status }}
            </div>

            <p class="order-number">No. Pesanan: <strong>{{ order.nomorPesanan }}</strong></p>

            <h3 class="card-title">{{ order.title }}</h3>

            <!-- Location -->
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
            </div>

            <div class="total-price">
              <span>Total: Rp {{ Number(order.totalBiaya || 0).toLocaleString('id-ID') }}</span>
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

<style scoped src="./PesananView.style.css"></style>
