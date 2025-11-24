<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';
import './EditPlace.style.css'; 

const router = useRouter();
const route = useRoute(); 
const isLoading = ref(false);
const isFetching = ref(true);

// Helper Image URL
const API_URL = 'http://localhost:3000/uploads/';
const getImageUrl = (filename) => {
  if (!filename || filename === 'default_place.jpg') return '/img/kolam.png';
  return `${API_URL}${filename}`;
}

const formData = reactive({
  namaProperti: '',
  deskripsi: '',
  alamatProperti: '',
  hargaSewa: '',
  satuanSewa: '',
  jamBuka: '',
  jamTutup: '',
  fotoPreview: null
});

// Load Data Lama
const loadData = async () => {
  try {
    const id = route.params.id;
    const res = await api.getPlaceById(id);
    const data = res.data.data || res.data;

    formData.namaProperti = data.title;
    formData.deskripsi = data.full_description || data.description;
    formData.alamatProperti = data.location;
    formData.hargaSewa = data.base_price;
    formData.satuanSewa = data.price_unit;
    
    // Reset jam karena di DB string gabungan
    formData.jamBuka = ''; 
    formData.jamTutup = '';

    formData.fotoPreview = getImageUrl(data.image_url);

  } catch (e) {
    console.error(e);
    alert("Gagal memuat data.");
    router.push('/mitra/properti-list'); // Redirect jika gagal load
  } finally {
    isFetching.value = false;
  }
};

const submitUpdate = async () => {
  isLoading.value = true;
  try {
    const id = route.params.id;
    
    await api.updatePlace(id, formData);
    
    alert("Data berhasil diperbarui!");
    
    // === PERUBAHAN DI SINI (Redirect ke Properti List) ===
    router.push('/mitra/properti-list'); 
    // =====================================================

  } catch (e) {
    console.error(e);
    alert("Gagal update: " + (e.response?.data?.message || "Server Error"));
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => loadData());
</script>

<template>
  <div class="form-page-wrapper">
    <div v-if="isFetching" class="loading-text">Memuat data lama...</div>

    <div v-else class="form-card">
      <h2 class="form-title">Edit Properti</h2>

      <form @submit.prevent="submitUpdate">
        <div class="form-group">
          <label>Nama Tempat</label>
          <input v-model="formData.namaProperti" type="text" required>
        </div>

        <div class="form-group">
           <label>Foto Saat Ini</label>
           <div class="image-preview-box">
               <img 
                 :src="formData.fotoPreview" 
                 @error="$event.target.src = '/img/kolam.png'"
                 style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;"
               >
           </div>
           <small style="color: #666; display:block; margin-top:5px;">
             *Upload foto baru belum tersedia di mode edit ini.
           </small>
        </div>

        <div class="form-group"><label>Deskripsi</label><textarea v-model="formData.deskripsi" rows="3"></textarea></div>
        <div class="form-group"><label>Alamat</label><textarea v-model="formData.alamatProperti" rows="2"></textarea></div>

        <div class="row">
           <div class="col"><label>Harga</label><input v-model="formData.hargaSewa" type="number"></div>
           <div class="col">
             <label>Satuan</label>
             <select v-model="formData.satuanSewa">
                <option>Jam</option><option>Hari</option><option>Kg</option><option>Tiket</option>
             </select>
           </div>
        </div>
        
        <div class="row">
           <div class="col">
             <label>Buka <small>(Isi untuk update)</small></label>
             <input v-model="formData.jamBuka" type="time">
           </div>
           <div class="col">
             <label>Tutup <small>(Isi untuk update)</small></label>
             <input v-model="formData.jamTutup" type="time">
           </div>
        </div>

        <div class="actions">
          <button type="button" class="btn-cancel" @click="router.push('/mitra/properti-list')">Batal</button>
          
          <button type="submit" class="btn-save" :disabled="isLoading">
            {{ isLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>