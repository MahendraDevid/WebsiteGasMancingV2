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
  if(file) {
    formData.fotoProperti = file;
    formData.fotoPreview = URL.createObjectURL(file);
  }
};

const submitForm = async () => {
  if(!formData.namaProperti || !formData.hargaSewa) return alert("Nama dan Harga wajib diisi");



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
               <option>Jam</option><option>Hari</option><option>Kg</option><option>Tiket</option>
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

<style scoped>
/* Style Mirip Registration tapi lebih simpel */
.form-page-wrapper { padding: 40px 20px; display: flex; justify-content: center; background: #f4f7fe; min-height: 90vh; }
.form-card { background: white; padding: 30px; border-radius: 12px; width: 100%; max-width: 600px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
.form-title { color: #0D2F64; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }

.form-group { margin-bottom: 15px; }
label { display: block; margin-bottom: 5px; font-weight: 600; font-size: 14px; color: #333; }
input, textarea, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px; }
input:focus, textarea:focus { border-color: #0D2F64; outline: none; }

.row { display: flex; gap: 15px; margin-bottom: 15px; }
.col { flex: 1; }

.upload-box { position: relative; height: 150px; border: 2px dashed #ccc; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #fafafa; overflow: hidden; }
.upload-box input { position: absolute; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
.preview { width: 100%; height: 100%; object-fit: cover; }

.actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn-save { background: #0D2F64; color: white; padding: 10px 25px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
.btn-cancel { background: #fff; border: 1px solid #ddd; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
</style>
