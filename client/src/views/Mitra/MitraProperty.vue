<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // Menggunakan Store
import api from '@/services/api';
import './MitraProperty.style.css'; // Import CSS terpisah

const router = useRouter();
const authStore = useAuthStore();

const bookings = ref([]);
const isLoading = ref(true);

// Helper Format Tanggal & Rupiah
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};
const formatRupiah = (num) => Number(num).toLocaleString('id-ID');

// Helper Warna Status
const mapStatusClass = (status) => {
  if (!status) return 'menunggu';
  const s = status.toLowerCase();
  if (s.includes('lunas') || s.includes('selesai')) return 'lunas';
  if (s.includes('batal')) return 'dibatalkan';
  return 'menunggu';
};

async function fetchBookings() {
  isLoading.value = true;

  if (!authStore.isAuthenticated || !authStore.isMitra) {
    router.push('/');
    return;
  }

  try {
    const mitraId = authStore.user?.id_mitra || authStore.user?.id;

    if (!mitraId) {
      console.error("ID Mitra tidak ditemukan di authStore");
      return;
    }

    const res = await api.getPropertyBookings(mitraId);

    // Mapping data dari response backend
    bookings.value = res.data.data.map(order => ({
      id: order.id_pesanan,
      image: order.place_image || 'https://placehold.co/600x400/0D2F64/FFFFFF?text=Kolam+Saya',  // Gambar tempat
      title: order.nama_tempat,  // Nama tempat
      customerName: order.nama_pemesan,  // Nama pemesan dari pengguna
      customerContact: order.kontak_pemesan,  // Kontak pemesan dari pengguna
      date: formatDate(order.tgl_pesan),  // Tanggal pesan
      total: order.total_biaya,  // Total biaya
      status: order.status_pesanan,  // Status pesanan
      statusClass: mapStatusClass(order.status_pesanan)  // Kelas CSS untuk status
    }));
  } catch (e) {
    console.error("Gagal mengambil data pesanan:", e);
    errorMessage.value = "Gagal memuat data pesanan. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }
}

// --- UPDATE STATUS PESANAN ---
const handleUpdateStatus = async (id, status) => {
  if (!confirm(`Ubah status pesanan ini menjadi ${status}?`)) return;
  try {
    await api.updatePropertyBookingStatus(id, status);
    fetchBookings(); // Refresh data
  } catch (e) { alert("Gagal update status"); }
};

// --- HAPUS PESANAN ---
const handleDelete = async (id) => {
  if (!confirm("Yakin ingin menghapus riwayat pesanan ini?")) return;
  try {
    await api.deletePropertyBooking(id);
    fetchBookings();
  } catch (e) { alert("Gagal hapus pesanan"); }
};

// --- NAVIGASI KE CRUD KOLAM ---
const goToManagePlaces = () => {
  // Mengarah ke halaman Properti.vue (List Kolam)
  // Pastikan nama route di index.js adalah 'mitra-place-list'
  router.push({ name: 'mitra-place-list' });
};

onMounted(() => {
  // Pastikan user load dari localstorage jika refresh
  if (!authStore.user) authStore.loadUserFromStorage();
  fetchBookings();
});
</script>

<template>
  <main class="mitra-property-wrapper">
    <div v-if="errorMessage" class="error-box">{{ errorMessage }}</div>
    <div class="header-section">
      <h1 class="page-title">Pesanan Masuk</h1>
      <p class="subtitle">Pantau siapa saja yang menyewa kolam Anda hari ini.</p>

      <div class="header-actions">
        <button class="btn-manage" @click="goToManagePlaces">
          ⚙️ Kelola Daftar Kolam & Harga
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loading-box">
      <div class="spinner"></div>
      <p>Memuat data pesanan...</p>
    </div>

    <div v-else class="order-list">
      <div class="order-card" v-for="order in bookings" :key="order.id">
        <div class="card-image">
          <img :src="order.image" loading="lazy" alt="Foto Tempat">
        </div>

        <div class="card-content">
          <div :class="['status-badge', order.statusClass]">{{ order.status }}</div>
          <h3 class="property-title">{{ order.title }}</h3>

          <div class="customer-info">
            <span class="icon">👤</span>
            <strong>{{ order.customerName }}</strong>
            <small v-if="order.customerContact">({{ order.customerContact }})</small>
          </div>

          <div class="info-grid">
            <div class="grid-item"><span>📅 {{ order.date }}</span></div>
            <div class="grid-item highlight"><span>Rp {{ formatRupiah(order.total) }}</span></div>
          </div>

          <div class="action-area">
            <select class="status-select" :value="order.status"
              @change="handleUpdateStatus(order.id, $event.target.value)">
              <option value="Menunggu Pembayaran">Menunggu Bayar</option>
              <option value="Lunas">Lunas / Dibayar</option>
              <option value="Selesai">Selesai Mancing</option>
              <option value="Dibatalkan">Batal</option>
            </select>

            <button class="btn-delete" @click="handleDelete(order.id)" title="Hapus Riwayat">
              🗑️
            </button>
          </div>
        </div>
      </div>

      <div v-if="bookings.length === 0" class="empty-state">
        <div style="font-size: 40px; margin-bottom: 10px;">📭</div>
        <h3>Belum ada pesanan masuk</h3>
        <p>Data pesanan dari pelanggan akan muncul di sini.</p>
      </div>
    </div>
  </main>
</template>
