<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();

const bookings = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');
const searchQuery = ref(''); // Untuk query search

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

// Computed untuk filter bookings berdasarkan search (hanya nama pemesan)
const filteredBookings = computed(() => {
  if (!searchQuery.value) return bookings.value;
  const query = searchQuery.value.toLowerCase();
  return bookings.value.filter(order =>
    order.customerName.toLowerCase().includes(query)
  );
});

async function fetchBookings() {
  isLoading.value = true;
  errorMessage.value = '';

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

    console.log("Data pesanan dari backend:", res.data.data);

    bookings.value = res.data.data.map(order => {
      console.log("Status pesanan untuk order ID", order.id_pesanan, ":", order.status_pesanan);
      return {
        id: order.id_pesanan,
        nomorPesanan: order.nomor_pesanan,
        customerName: order.nama_pemesan,
        customerContact: order.kontak_pemesan,
        date: formatDate(order.tgl_mulai_sewa),
        total: order.total_biaya,
        status: order.status_pesanan || 'Tidak Diketahui',
        statusClass: mapStatusClass(order.status_pesanan)
      };
    });
  } catch (e) {
    console.error("Gagal mengambil data pesanan:", e);
    errorMessage.value = "Gagal memuat data pesanan. Silakan coba lagi.";
  } finally {
    isLoading.value = false;
  }
}

// Update Status Pesanan
const handleUpdateStatus = async (id, status) => {
  if (!confirm(`Ubah status pesanan ini menjadi ${status}?`)) return;
  try {
    await api.updatePropertyBookingStatus(id, status);
    fetchBookings();
  } catch (e) { alert("Gagal update status"); }
};

// Hapus Pesanan
const handleDelete = async (id) => {
  if (!confirm("Yakin ingin menghapus riwayat pesanan ini?")) return;
  try {
    await api.deletePropertyBooking(id);
    fetchBookings();
  } catch (e) { alert("Gagal hapus pesanan"); }
};

// Navigasi ke CRUD Kolam
const goToManagePlaces = () => {
  router.push({ name: 'mitra-place-list' });
};

onMounted(() => {
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

    <div class="pesanan-wrapper">
      <!-- Search Input di Atas Tabel -->
      <h1>Pesanan Masuk</h1>
      <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nama pemesan..." class="search-input">
        
      </div>

      <div v-if="isLoading" class="loading-box">
        <div class="spinner"></div>
        <p>Memuat data pesanan...</p>
      </div>

      <div v-else class="table-container">
        <table class="order-table">
          <thead>
            <tr>
              <th>No Pesanan</th>
              <th>Pemesan</th>
              <th>Orang</th>
              <th>Tanggal Sewa</th>
              <th>Total</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredBookings" :key="order.id">
              <td>{{ order.nomorPesanan }}</td>
              <td>{{ order.customerName }}</td>
              <td>{{ order.customerContact || '-' }}</td>
              <td>{{ order.date }}</td>
              <td class="highlight">Rp {{ formatRupiah(order.total) }}</td>
              <td>
                <span :class="['status-badge', order.statusClass]" v-if="order.status">{{ order.status }}</span>
                <span v-else style="color: red; font-weight: bold;">DEBUG: Status Kosong</span>
              </td>
              <td class="action-cell">
                <select class="status-select" :value="order.status"
                  @change="handleUpdateStatus(order.id, $event.target.value)">
                  <option value="Menunggu Pembayaran">Menunggu Bayar</option>
                  <option value="Lunas">Lunas / Dibayar</option>
                  <option value="Selesai">Selesai Mancing</option>
                  <option value="Dibatalkan">Batal</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredBookings.length === 0 && !isLoading" class="empty-state">
          <h3>{{ searchQuery ? 'Tidak ada hasil pencarian...' : 'Belum ada pesanan masuk' }}</h3>
          <p>{{ searchQuery ? 'Coba kata kunci lain.' : 'Data pesanan dari pelanggan akan muncul di sini.' }}</p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped src="./MitraProperty.style.css"></style>