<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
import './Properti.style.css'; // Import CSS Terpisah

const router = useRouter();
const authStore = useAuthStore();

const places = ref([]);
const isLoading = ref(true);

// Helper Format Rupiah
const formatRupiah = (num) => Number(num).toLocaleString('id-ID');

// Fetch Data Kolam
const fetchPlaces = async () => {
  if (!authStore.isAuthenticated || !authStore.isMitra) {
      router.push('/'); return;
  }

  try {
    // Ambil ID Mitra dari Store
    const mitraId = authStore.user?.id_mitra || authStore.user?.id;

    // Panggil API (backend harus support ?mitra_id=...)
    const res = await api.getPlacesByMitra(mitraId);
    places.value = res.data.data || [];
  } catch (error) {
    console.error("Gagal ambil data tempat:", error);
  } finally {
    isLoading.value = false;
  }
};

// Navigasi
const goToAdd = () => router.push({ name: 'mitra-add-place' });
const goToEdit = (id) => router.push({ name: 'mitra-edit-place', params: { id } });
const backToDashboard = () => router.push('/mitra/properti');

// Delete Logic
const handleDelete = async (id) => {
  if (!confirm("Yakin hapus kolam ini? Data tidak bisa dikembalikan.")) return;
  try {
    await api.deletePlace(id);
    fetchPlaces(); // Refresh list
  } catch (e) { alert("Gagal menghapus tempat."); }
};

onMounted(() => {
    if (!authStore.user) authStore.loadUserFromStorage();
    fetchPlaces();
});
</script>

<template>
  <div class="crud-page-wrapper">

    <div class="top-nav">
        <button class="btn-back" @click="backToDashboard">
            ← Kembali ke Pesanan Masuk
        </button>
    </div>

    <div class="header-action">
      <div class="title-group">
        <h1 class="page-title">Daftar Kolam Saya</h1>
        <p class="subtitle">Kelola informasi tempat pemancingan Anda di sini.</p>
      </div>
      <button class="btn-add" @click="goToAdd">
        <span class="plus-icon">+</span> Tambah Kolam
      </button>
    </div>

    <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Memuat data kolam...</p>
    </div>

    <div v-else class="table-container">
      <table class="custom-table" v-if="places.length > 0">
        <thead>
          <tr>
            <th width="15%">Gambar</th>
            <th width="30%">Nama Tempat</th>
            <th width="25%">Lokasi</th>
            <th width="20%">Harga</th>
            <th width="10%" class="text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in places" :key="p.id_tempat">
            <td>
                <div class="img-wrapper">
                    <img :src="p.image_url || 'https://placehold.co/100x70?text=No+Img'" class="thumb-img" alt="Foto Kolam">
                </div>
            </td>
            <td>
                <strong class="place-title">{{ p.title }}</strong>
            </td>
            <td>
                <div class="place-location">{{ p.location }}</div>
            </td>
            <td>
                <div class="place-price">Rp {{ formatRupiah(p.base_price) }}</div>
                <small class="price-unit">/ {{ p.price_unit }}</small>
            </td>
            <td>
              <div class="btn-group">
                <button class="btn-edit" @click="goToEdit(p.id_tempat)" title="Edit">✏️</button>
                <button class="btn-del" @click="handleDelete(p.id_tempat)" title="Hapus">🗑️</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="empty-state">
        <div class="empty-icon">🎣</div>
        <h3>Belum ada kolam terdaftar</h3>
        <p>Mulai tambahkan tempat pemancingan Anda sekarang.</p>
        <button class="btn-add-sm" @click="goToAdd">Tambah Kolam Pertama</button>
      </div>
    </div>
  </div>
</template>
