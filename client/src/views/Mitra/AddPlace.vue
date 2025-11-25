<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();
const isLoading = ref(false);

// State Data Tempat
const form = ref({
  title: '',
  description: '',
  location: '',
  price: '',
  unit: 'jam',
  jam_buka: '07:00',
  jam_tutup: '17:00',
  fasilitas: [] 
});

const mainImageFile = ref(null);
const mainImagePreview = ref(null);
const items = ref([]);

// --- CEK SESI SAAT LOAD ---
onMounted(async () => {
  if (!authStore.user) {
    await authStore.loadUserFromStorage();
  }
  console.log("Current User Data:", authStore.user);
});

const handleMainImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    mainImageFile.value = file;
    mainImagePreview.value = URL.createObjectURL(file);
  }
};

// ✅ PERBAIKAN: Gunakan nama field yang sama dengan v-model
const addItem = () => {
  items.value.push({ 
    nama_item: '',      // ✅ Sesuai dengan v-model di template
    price: '',          // ✅ Sesuai dengan v-model di template
    price_unit: 'pcs',  // ✅ Sesuai dengan v-model di template
    file: null, 
    preview: null 
  });
};

const removeItem = (index) => {
  items.value.splice(index, 1);
};

const handleItemImageUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    items.value[index].file = file; 
    items.value[index].preview = URL.createObjectURL(file);
  }
};

const submitForm = async () => {
  // 1. Validasi Input Dasar
  if (!form.value.title || !form.value.price) {
    alert("Mohon lengkapi data wajib (Nama & Harga)");
    return;
  }

  // 2. Validasi Items - Pastikan tidak ada field kosong
  const hasInvalidItems = items.value.some(item => 
    !item.nama_item || !item.price || !item.price_unit
  );
  
  if (hasInvalidItems) {
    alert("Mohon lengkapi semua data item (Nama, Harga, Satuan)");
    return;
  }

  // 3. AMBIL ID MITRA
  const mitraId = authStore.user?.id_mitra || authStore.user?.id || authStore.user?.user_id;

  console.log("Mengirim dengan ID Mitra:", mitraId);
  console.log("Items yang akan dikirim:", items.value); // Debug items

  // 4. Validasi ID Mitra
  if (!mitraId) {
    alert("Gagal mengidentifikasi Mitra. Sesi Anda mungkin berakhir. Silakan login ulang.");
    return;
  }

  isLoading.value = true;

  try {
    const formData = new FormData();

    // Append Text Data
    formData.append('title', form.value.title);
    formData.append('description', form.value.description);
    formData.append('location', form.value.location);
    formData.append('base_price', form.value.price);
    formData.append('price_unit', form.value.unit);
    formData.append('jam_buka', form.value.jam_buka);
    formData.append('jam_tutup', form.value.jam_tutup);
    formData.append('fasilitas', JSON.stringify(form.value.fasilitas)); 
    formData.append('mitra_id', mitraId); 

    // Append Main Image
    if (mainImageFile.value) {
      formData.append('image_url', mainImageFile.value);
    }

    // ✅ PERBAIKAN: Gunakan nama field yang benar
    items.value.forEach((item, index) => {
      formData.append(`items[${index}][nama_item]`, item.nama_item);    // ✅
      formData.append(`items[${index}][price]`, item.price);            // ✅
      formData.append(`items[${index}][price_unit]`, item.price_unit);  // ✅
      if (item.file) {
        formData.append(`items[${index}][image_url]`, item.file);
      }
    });

    // Debug: Tampilkan isi FormData
    console.log("=== FormData Contents ===");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    await api.createPlace(formData); 
    
    alert("Kolam berhasil ditambahkan!");
    router.push('/mitra/properti');

  } catch (error) {
    console.error("Error Submit:", error);
    const msg = error.response?.data?.message || "Gagal menambahkan kolam.";
    alert(`Gagal: ${msg}`);
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="add-place-container">
    <h1>Tambah Kolam Baru</h1>
    
    <div class="form-wrapper">
      <section class="form-section">
        <h3>Informasi Umum</h3>
        
        <div class="form-group">
          <label>Nama Tempat *</label>
          <input v-model="form.title" type="text" placeholder="Cth: Pemancingan Barokah" required>
        </div>

        <div class="form-group">
          <label>Foto Utama Tempat</label>
          <div class="image-upload-box" @click="$refs.mainInput.click()">
            <input 
              ref="mainInput"
              type="file" 
              @change="handleMainImageUpload" 
              accept="image/*"
              style="display: none;"
            >
            <div v-if="mainImagePreview" class="preview-box">
              <img :src="mainImagePreview" alt="Preview">
              <p style="margin-top:10px; font-size:0.8rem; color:#666;">Klik untuk ganti foto</p>
            </div>
            <div v-else>
              <span style="font-size: 2rem;">📷</span>
              <p>Klik untuk upload foto utama</p>
            </div>
          </div>
        </div>

        <div class="row-group">
          <div class="form-group">
            <label>Harga Dasar (Rp) *</label>
            <input v-model="form.price" type="number" placeholder="50000">
          </div>
          <div class="form-group">
            <label>Satuan</label>
            <select v-model="form.unit">
              <option value="jam">Per Jam</option>
              <option value="hari">Per Hari</option>
              <option value="kg">Per Kg (Ikan)</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Lokasi / Alamat</label>
          <textarea v-model="form.location" rows="2" placeholder="Alamat lengkap lokasi"></textarea>
        </div>

        <div class="form-group">
          <label>Deskripsi Lengkap</label>
          <textarea v-model="form.description" rows="4" placeholder="Jelaskan keunggulan kolam Anda..."></textarea>
        </div>

        <div class="row-group">
          <div class="form-group">
            <label>Jam Buka</label>
            <input v-model="form.jam_buka" type="time">
          </div>
          <div class="form-group">
            <label>Jam Tutup</label>
            <input v-model="form.jam_tutup" type="time">
          </div>
        </div>
      </section>

      <section class="form-section">
        <div class="section-header">
          <h3>Peralatan Sewa / Tambahan</h3>
          <button type="button" class="btn-small" @click="addItem">+ Tambah Item</button>
        </div>
        <p class="hint">Masukkan alat pancing, umpan, atau item yang bisa disewa pengunjung.</p>

        <div v-if="items.length === 0" style="text-align: center; color: #999; padding: 20px;">
          Belum ada item sewa. Klik "+ Tambah Item" jika ada.
        </div>

        <div v-for="(item, index) in items" :key="index" class="item-card">
          <div class="item-header">
            <span>Item #{{ index + 1 }}</span>
            <button type="button" class="btn-remove" @click="removeItem(index)">Hapus</button>
          </div>
          
          <div class="item-grid">
            <div class="item-image-col">
              <div class="mini-upload">
                <input type="file" @change="(e) => handleItemImageUpload(e, index)" accept="image/*">
                <div v-if="item.preview" class="mini-preview">
                  <img :src="item.preview" />
                </div>
                <div v-else class="placeholder">
                  <span>➕</span>
                  <small>Foto</small>
                </div>
              </div>
            </div>

            <div class="item-data-col">
              <input v-model="item.nama_item" type="text" placeholder="Nama Alat (Cth: Joran)" required>
              <div class="price-row">
                <input v-model="item.price" type="number" placeholder="Harga">
                <select v-model="item.price_unit">
                  <option value="pcs">/ Pcs</option>
                  <option value="pax">/ Pax</option>
                  <option value="kg">/ Kg</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="form-actions">
        <button class="btn-cancel" @click="$router.back()">Batal</button>
        <button class="btn-submit" @click="submitForm" :disabled="isLoading">
          {{ isLoading ? 'Menyimpan Data...' : 'Simpan Data' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped src="./AddPlace.style.css"></style>