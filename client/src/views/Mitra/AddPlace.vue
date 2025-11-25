<script setup>
import { reactive, ref, onMounted } from 'vue'; 
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; 
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);

// --- State Facility Options (Dinamis dari API) ---
const facilityOptions = ref([]); 

// --- Load Facilities from Backend ---
const loadFacilities = async () => {
  try {
    const response = await api.getAllFacilities();
    if (response.data.success) {
      facilityOptions.value = response.data.data;
    }
  } catch (error) {
    console.error("Gagal memuat fasilitas:", error);
    // Fallback hanya jika API error
    facilityOptions.value = [
      { id: 1, name: 'Toilet' }, { id: 2, name: 'Musholla' }, { id: 3, name: 'Parkiran' }
    ];
  }
};

onMounted(() => {
  loadFacilities(); 
});

const user = authStore.currentUser; 

if (!user || user.role !== 'mitra') {
    // alert("Akses ditolak."); 
    // router.push('/login');
}

const formData = reactive({
  namaProperti: '',
  deskripsi: '',
  alamatProperti: '',
  hargaSewa: '',
  satuanSewa: 'Jam',
  jamBuka: '08:00',
  jamTutup: '17:00',
  fasilitas: [], 
  items: [],
  fotoProperti: null,
  fotoPreview: null
});

const itemTypeOptions = ['Peralatan', 'Umpan', 'Fasilitas Berbayar', 'Lainnya'];
const itemUnitOptions = ['Pcs/Item', 'Kg', 'Bungkus', 'Jam', 'Hari', 'Tiket'];

const handleFile = (e) => {
  const file = e.target.files[0];
  if (file) {
    formData.fotoProperti = file;
    formData.fotoPreview = URL.createObjectURL(file);
  }
};

// --- [BARU] Handle Upload Foto per Item ---
const handleItemImageUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    formData.items[index].image_file = file;
    formData.items[index].image_preview = URL.createObjectURL(file);
  }
};

const addItem = () => {
  formData.items.push({
    // --- [BARU] Tambah field untuk gambar
    nama_item: '', price: '', price_unit: 'Pcs/Item', tipe_item: 'Peralatan', 
    image_file: null, image_preview: null 
  });
};

const removeItem = (index) => { formData.items.splice(index, 1); };

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
    const submissionData = new FormData();

    submissionData.append('id_mitra', user.id_mitra || user.id); 
    submissionData.append('namaProperti', formData.namaProperti);
    submissionData.append('alamatProperti', formData.alamatProperti);
    submissionData.append('hargaSewa', formData.hargaSewa);
    submissionData.append('satuanSewa', formData.satuanSewa);
    submissionData.append('jamBuka', formData.jamBuka);
    submissionData.append('jamTutup', formData.jamTutup);
    submissionData.append('deskripsi', formData.deskripsi);

    if(formData.fotoProperti) {
        submissionData.append('fotoProperti', formData.fotoProperti);
    }

    submissionData.append('fasilitas', JSON.stringify(formData.fasilitas));
    
    // --- [UPDATE] Loop item agar gambar terkirim ---
    formData.items.forEach((item, index) => {
        submissionData.append(`items[${index}][nama_item]`, item.nama_item);
        submissionData.append(`items[${index}][price]`, item.price);
        submissionData.append(`items[${index}][price_unit]`, item.price_unit);
        submissionData.append(`items[${index}][tipe_item]`, item.tipe_item);

        // Kirim gambar item jika ada
        if (item.image_file) {
            submissionData.append(`items[${index}][image]`, item.image_file);
        }
    });

    await api.createPlace(submissionData); 
    
    alert("Berhasil menambahkan tempat pemancingan!");
    
    // --- [UPDATE] Redirect ke Properti List ---
    router.push('/mitra/properti-list'); 

  } catch (e) {
    console.error(e);
    alert("Gagal menyimpan data: " + (e.response?.data?.message || e.message));
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
          <label>Deskripsi</label>
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

        <div class="section facilities-section">
          <h2>Fasilitas</h2>
          <div class="checkbox-grid">
            <label v-for="fac in facilityOptions" :key="fac.id" class="checkbox-card">
                <input type="checkbox" :value="fac.id" v-model="formData.fasilitas">
                <span>{{ fac.name }}</span>
            </label>
          </div>
        </div>

        <div class="divider">Item Sewa & Jualan</div>
        
        <div class="items-container">
             <div v-for="(item, index) in formData.items" :key="index" class="item-card">
                <div class="item-header">
                    <h4>Item #{{ index + 1 }}</h4>
                    <button type="button" class="btn-remove" @click="removeItem(index)">Hapus</button>
                </div>
                
                <div class="item-body">
                  <div class="item-image-upload">
                    <div class="preview-box" :style="{ backgroundImage: item.image_preview ? `url(${item.image_preview})` : 'none' }">
                        <input type="file" accept="image/*" @change="(e) => handleItemImageUpload(e, index)">
                        <span v-if="!item.image_preview">+</span>
                    </div>
                  </div>
                  <div class="item-inputs">
                    <div class="form-group"><label>Nama</label><input type="text" v-model="item.nama_item"></div>
                    <div class="row">
                        <div class="col"><label>Harga</label><input type="number" v-model="item.price"></div>
                        <div class="col"><label>Satuan</label><select v-model="item.price_unit"><option v-for="o in itemUnitOptions">{{o}}</option></select></div>
                    </div>
                    <div class="form-group"><label>Tipe</label><select v-model="item.tipe_item"><option v-for="o in itemTypeOptions">{{o}}</option></select></div>
                  </div>
                </div>
             </div>
             <button type="button" class="btn-add-item" @click="addItem">+ Tambah Item</button>
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
