<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const isLoading = ref(false);

const formData = reactive({
  namaProperti: '',
  deskripsi: '',
  alamatProperti: '',
  hargaSewa: '',
  satuanSewa: 'Jam',
  jamBuka: '08:00',
  jamTutup: '17:00',
  fotoProperti: null,
  fotoPreview: null
});

// Ambil ID Mitra dari Session
const user = JSON.parse(localStorage.getItem('user') || '{}');

const handleFile = (e) => {
  const file = e.target.files[0];
  if (file) {
    formData.fotoProperti = file;
    formData.fotoPreview = URL.createObjectURL(file);
  }
};

const submitForm = async () => {
  if (!formData.namaProperti || !formData.hargaSewa) return alert("Nama dan Harga wajib diisi");



  // DEBUGGING: Cek apakah ID Mitra terbaca?
  console.log("User saat ini:", user);
  console.log("ID Mitra yang akan dikirim:", user.id_mitra);

  if (!user.id_mitra) {
    alert("Error: ID Mitra tidak ditemukan. Silakan logout dan login ulang.");
    return;
  }

  isLoading.value = true;
  try {
    // Susun Payload
    const payload = {
      ...formData,
      id_mitra: user.id_mitra // WAJIB: Link ke mitra yg login
    };

    await api.createPlace(payload);
    alert("Berhasil menambahkan kolam!");
    router.push('/mitra/properti'); // Balik ke list
  } catch (e) {
    console.error(e);
    alert("Gagal menyimpan data.");
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="form-page-wrapper">
    <div class="form-card">
      <h2 class="form-title">Tambah Tempat Pemancingan</h2>

      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Nama Tempat</label>
          <input v-model="formData.namaProperti" type="text" placeholder="Contoh: Kolam Harian Berkah" required>
        </div>

        <div class="form-group">
          <label>Foto Utama</label>
          <div class="upload-box">
            <input type="file" @change="handleFile" accept="image/*">
            <div v-if="!formData.fotoPreview" class="placeholder">📸 Upload Foto</div>
            <img v-else :src="formData.fotoPreview" class="preview">
          </div>
        </div>

        <div class="form-group">
          <label>Deskripsi & Fasilitas</label>
          <textarea v-model="formData.deskripsi" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label>Alamat Lengkap</label>
          <textarea v-model="formData.alamatProperti" rows="2" required></textarea>
        </div>

        <div class="row">
          <div class="col">
            <label>Harga (Rp)</label>
            <input v-model="formData.hargaSewa" type="number" required>
          </div>
          <div class="col">
            <label>Satuan</label>
            <select v-model="formData.satuanSewa">
              <option>Jam</option>
              <option>Hari</option>
              <option>Kg</option>
              <option>Tiket</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div class="col"><label>Buka</label><input v-model="formData.jamBuka" type="time"></div>
          <div class="col"><label>Tutup</label><input v-model="formData.jamTutup" type="time"></div>
        </div>

        <div class="actions">
          <button type="button" class="btn-cancel" @click="router.back()">Batal</button>
          <button type="submit" class="btn-save" :disabled="isLoading">
            {{ isLoading ? 'Menyimpan...' : 'Simpan Properti' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped src="./AddPlace.style.css"></style>