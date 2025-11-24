<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';
import './EditPlace.style.css'; // Import CSS Terpisah

const router = useRouter();
const route = useRoute(); // Ambil ID dari URL
const isLoading = ref(false);
const isFetching = ref(true);

const formData = reactive({
  namaProperti: '',
  deskripsi: '',
  alamatProperti: '',
  hargaSewa: '',
  satuanSewa: '',
  jamBuka: '',
  jamTutup: '',
  fotoPreview: null // Untuk menampung URL gambar lama
});

// Load Data Lama
const loadData = async () => {
  try {
    const id = route.params.id;
    const res = await api.getPlaceById(id); // Pastikan api.js punya fungsi ini atau gunakan get generic
    const data = res.data.data || res.data; // Sesuaikan respon

    // Isi Form
    formData.namaProperti = data.title;
    formData.deskripsi = data.description;
    formData.alamatProperti = data.location;
    formData.hargaSewa = data.base_price;
    formData.satuanSewa = data.price_unit;
    formData.jamBuka = data.jam_buka;
    formData.jamTutup = data.jam_tutup;
    formData.fotoPreview = data.image_url;

  } catch (e) {
    alert("Gagal memuat data.");
    router.push('/mitra/properti');
  } finally {
    isFetching.value = false;
  }
};

const submitUpdate = async () => {
  isLoading.value = true;
  try {
    const id = route.params.id;
    // Kirim hanya data yg perlu diupdate
    await api.updatePlace(id, formData);
    alert("Data berhasil diperbarui!");
    router.push('/mitra/properti');
  } catch (e) {
    console.error(e);
    alert("Gagal update.");
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => loadData());
</script>

<template>
  <div class="form-page-wrapper">
    <div v-if="isFetching">Memuat data lama...</div>

    <div v-else class="form-card">
      <h2 class="form-title">Edit Properti</h2>

      <form @submit.prevent="submitUpdate">
        <div class="form-group">
          <label>Nama Tempat</label>
          <input v-model="formData.namaProperti" type="text" required>
        </div>

        <div class="form-group">
           <label>Foto Saat Ini</label>
           <img :src="formData.fotoPreview" style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px;">
           <small style="color: #666;">*Upload ulang foto belum tersedia di mode edit cepat.</small>
        </div>

        <div class="form-group"><label>Deskripsi</label><textarea v-model="formData.deskripsi" rows="3"></textarea></div>
        <div class="form-group"><label>Alamat</label><textarea v-model="formData.alamatProperti" rows="2"></textarea></div>

        <div class="row">
           <div class="col"><label>Harga</label><input v-model="formData.hargaSewa" type="number"></div>
           <div class="col"><label>Satuan</label><select v-model="formData.satuanSewa"><option>Jam</option><option>Hari</option></select></div>
        </div>
        <div class="row">
           <div class="col"><label>Buka</label><input v-model="formData.jamBuka" type="time"></div>
           <div class="col"><label>Tutup</label><input v-model="formData.jamTutup" type="time"></div>
        </div>

        <div class="actions">
          <button type="button" class="btn-cancel" @click="router.back()">Batal</button>
          <button type="submit" class="btn-save" :disabled="isLoading">Simpan Perubahan</button>
        </div>
      </form>
    </div>
  </div>
</template>


