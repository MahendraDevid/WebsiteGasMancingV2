<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../services/api';
import './MitraRegistration.style.css';

const router = useRouter();
const currentStep = ref(1);
const showSuccessModal = ref(false);
const showTermsModal = ref(false);

// --- Opsi Data Statis ---
const facilityOptions = [
  { id: 1, name: 'Toilet' },
  { id: 2, name: 'Musholla' },
  { id: 3, name: 'Parkiran' }
];

const itemTypeOptions = ['Peralatan', 'Umpan', 'Fasilitas Berbayar', 'Lainnya'];
const itemUnitOptions = ['Pcs/Item', 'Kg', 'Bungkus', 'Jam', 'Hari', 'Tiket'];

// --- Main Form Data ---
const formData = reactive({
  // Bagian 1: Properti (Data ini disimpan terpisah/nanti)
  namaProperti: '',
  deskripsi: '',
  fotoProperti: null,
  fotoPropertiPreview: null,
  alamatProperti: '',
  jamBuka: '',
  jamTutup: '',
  hargaSewa: '',
  satuanSewa: 'Jam',
  fasilitas: [],
  items: [],

  // Bagian 2: Mitra (Data Diri - NAMA VARIABEL DISAMAKAN DENGAN DATABASE)
  nama_lengkap: '',        // Database: nama_lengkap
  no_telepon: '',          // Database: no_telepon
  email: '',               // Database: email
  password: '',            // Input user (nanti dikirim sebagai password_hash)

  // Bagian 2: Bank
  nama_bank: 'BCA',        // Database: nama_bank
  no_rekening: '',         // Database: no_rekening
  atas_nama_rekening: '',  // Database: atas_nama_rekening
  alamat: '',              // Database: alamat

  // Step 3
  agreedToTerms: false
});

// --- Logic Upload & Item ---
const handlePropertyPhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.fotoProperti = file;
    formData.fotoPropertiPreview = URL.createObjectURL(file);
  }
};

const addItem = () => {
  formData.items.push({
    nama_item: '', price: '', price_unit: 'Pcs/Item', tipe_item: 'Peralatan', image_file: null, image_preview: null
  });
};

const removeItem = (index) => { formData.items.splice(index, 1); };

const handleItemImageUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    formData.items[index].image_file = file;
    formData.items[index].image_preview = URL.createObjectURL(file);
  }
};

const getFacilityNames = () => {
  return facilityOptions.filter(opt => formData.fasilitas.includes(opt.id)).map(opt => opt.name).join(', ');
};

const formatRupiah = (number) => {
  if (!number) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};

// --- Navigasi ---
function nextStep() {
  if (currentStep.value === 1) {
    if (!formData.namaProperti || !formData.alamatProperti) {
      return alert("Mohon lengkapi Nama dan Alamat Properti.");
    }
    // Auto-fill alamat mitra dari alamat properti jika kosong
    if (!formData.alamat) {
        formData.alamat = formData.alamatProperti;
    }
    currentStep.value = 2;
  } else if (currentStep.value === 2) {
    // VALIDASI: Pastikan Password diisi
    if (!formData.nama_lengkap || !formData.no_telepon || !formData.email || !formData.password) {
      return alert("Mohon lengkapi Data Pemilik (Nama, Email, Password, No HP).");
    }
    currentStep.value = 3;
  }
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--;
}

// --- SUBMIT LOGIC (LOGIKA UTAMA) ---
async function submitRegistration() {
  if (!formData.agreedToTerms) return alert("Anda harus menyetujui Syarat & Ketentuan.");

  try {
    // 1. Siapkan Payload (Mapping Data)
    // Backend membutuhkan field 'password_hash', tapi input kita namanya 'password'
    const payload = {
      ...formData,
      password_hash: formData.password
    };

    // 2. Kirim ke API (api.js yang bersih)
    const response = await api.createMitra(payload);

    console.log("Sukses:", response.data);
    showSuccessModal.value = true;

  } catch (error) {
    console.error("Gagal Daftar:", error);
    // Ambil pesan error dari backend jika ada
    const msg = error.response?.data?.message || "Terjadi kesalahan koneksi.";
    alert("Gagal mendaftar: " + msg);
  }
}

function finishRegistration() {
  showSuccessModal.value = false;
  router.push({ name: 'mitra-landing' });
}
</script>

<template>
  <main class="registration-page-wrapper">
    <div class="registration-container">

      <div class="stepper-wrapper">
        <div :class="['step-item', { active: currentStep >= 1 }]"><div class="step-circle">1</div><span>Properti</span></div>
        <div class="step-line"></div>
        <div :class="['step-item', { active: currentStep >= 2 }]"><div class="step-circle">2</div><span>Pemilik</span></div>
        <div class="step-line"></div>
        <div :class="['step-item', { active: currentStep >= 3 }]"><div class="step-circle">3</div><span>Konfirmasi</span></div>
      </div>

      <div class="form-card">
        <h2 class="step-title">
          {{ currentStep === 1 ? 'Informasi Properti' : currentStep === 2 ? 'Informasi Pemilik & Akun' : 'Konfirmasi Data' }}
        </h2>

        <div v-if="currentStep === 1" class="form-step-content">
          <div class="form-group">
            <label>Nama Pemancingan</label>
            <input type="text" v-model="formData.namaProperti" placeholder="Contoh: Pemancingan Telaga Biru">
          </div>
           <div class="form-group">
            <label>Foto Lokasi Utama</label>
            <div class="property-photo-uploader">
              <input type="file" accept="image/*" @change="handlePropertyPhotoUpload">
              <div v-if="!formData.fotoPropertiPreview" class="photo-placeholder"><span>📷</span><p>Klik upload foto</p></div>
              <img v-else :src="formData.fotoPropertiPreview" class="photo-preview-img">
            </div>
          </div>
          <div class="form-group"><label>Deskripsi</label><textarea v-model="formData.deskripsi" rows="2"></textarea></div>
          <div class="form-group"><label>Alamat</label><textarea v-model="formData.alamatProperti" rows="2"></textarea></div>
          <div class="form-row">
            <div class="form-group"><label>Buka</label><input type="time" v-model="formData.jamBuka"></div>
            <div class="form-group"><label>Tutup</label><input type="time" v-model="formData.jamTutup"></div>
          </div>
          <div class="form-row">
             <div class="form-group"><label>Harga</label><input type="number" v-model="formData.hargaSewa"></div>
             <div class="form-group">
              <label>Satuan</label>
              <select v-model="formData.satuanSewa"><option>Jam</option><option>Hari</option><option>Tiket</option><option>Kg</option></select>
            </div>
          </div>
          <div class="divider">Fasilitas & Item</div>
          <br>    
          <div class="checkbox-grid">
            <label v-for="fac in facilityOptions" :key="fac.id" class="checkbox-card">
              <input type="checkbox" :value="fac.id" v-model="formData.fasilitas"><span>{{ fac.name }}</span>
            </label>
          </div>
          <br>
          <div class="items-container">
             <div v-for="(item, index) in formData.items" :key="index" class="item-card">
                <div class="item-header"><h4>Item #{{ index + 1 }}</h4><button class="btn-remove" @click="removeItem(index)">Hapus</button></div>
                <div class="item-body">
                  <div class="item-image-upload">
                    <div class="preview-box" :style="{ backgroundImage: item.image_preview ? `url(${item.image_preview})` : 'none' }"><span v-if="!item.image_preview">+</span></div>
                    <input type="file" accept="image/*" @change="(e) => handleItemImageUpload(e, index)">
                  </div>
                  <div class="item-inputs">
                    <div class="form-group"><label>Nama</label><input type="text" v-model="item.nama_item"></div>
                    <div class="form-row">
                      <div class="form-group"><label>Harga</label><input type="number" v-model="item.price"></div>
                      <div class="form-group"><label>Satuan</label><select v-model="item.price_unit"><option v-for="o in itemUnitOptions">{{o}}</option></select></div>
                    </div>
                    <div class="form-group"><label>Tipe</label><select v-model="item.tipe_item"><option v-for="o in itemTypeOptions">{{o}}</option></select></div>
                  </div>
                </div>
             </div>
             <button class="btn-add-item" @click="addItem">+ Tambah Item</button>
          </div>
        </div>

        <div v-if="currentStep === 2" class="form-step-content">
          <div class="form-group">
            <label>Nama Lengkap Pemilik</label>
            <input type="text" v-model="formData.nama_lengkap" placeholder="Sesuai KTP">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Nomor WhatsApp</label>
              <input type="tel" v-model="formData.no_telepon" placeholder="0812...">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="formData.email" placeholder="email@anda.com">
            </div>
          </div>
          <div class="form-group">
            <label>Buat Password Akun</label>
            <input type="password" v-model="formData.password" placeholder="Minimal 6 karakter">
          </div>

          <div class="divider">Informasi Rekening</div><br>
          <div class="form-group">
            <label>Bank</label>
            <select v-model="formData.nama_bank"><option>BCA</option><option>BRI</option><option>Mandiri</option><option>BNI</option><option>Jago</option></select>
          </div>
          <div class="form-row">
            <div class="form-group"><label>No. Rekening</label><input type="text" v-model="formData.no_rekening"></div>
            <div class="form-group"><label>Atas Nama</label><input type="text" v-model="formData.atas_nama_rekening"></div>
          </div>
        </div>

        <div v-if="currentStep === 3" class="form-step-content confirmation-view">
          <div class="summary-section">
            <h3>🏠 Properti</h3>
            <div class="summary-grid">
              <div class="sum-item full"><strong>Nama:</strong> {{ formData.namaProperti }}</div>
              <div class="sum-item"><strong>Alamat:</strong> {{ formData.alamatProperti }}</div>
            </div>
          </div>
          <div class="summary-section">
            <h3>👤 Akun Mitra</h3>
            <div class="summary-grid">
              <div class="sum-item"><strong>Nama:</strong> {{ formData.nama_lengkap }}</div>
              <div class="sum-item"><strong>Email:</strong> {{ formData.email }}</div>
              <div class="sum-item"><strong>Kontak:</strong> {{ formData.no_telepon }}</div>
              <div class="sum-item"><strong>Password:</strong> ********</div>
              <div class="sum-item full"><strong>Bank:</strong> {{ formData.nama_bank }} - {{ formData.no_rekening }}</div>
            </div>
          </div>
          <div class="agreement-box">
            <label class="checkbox-container">
              <input type="checkbox" v-model="formData.agreedToTerms">
              <span class="checkmark"></span>
              <span class="agreement-text">Saya menyetujui <a href="#">Syarat & Ketentuan</a>.</span>
            </label>
          </div>
        </div>

        <div class="form-actions">
          <button v-if="currentStep > 1" class="btn-back" @click="prevStep">Kembali</button>
          <button v-if="currentStep < 3" class="btn-next" @click="nextStep">Lanjut</button>
          <button v-if="currentStep === 3" class="btn-submit" @click="submitRegistration">Daftarkan Sekarang</button>
        </div>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <div class="success-icon-circle">✔</div>
        <h2>Berhasil Mendaftar!</h2>
        <p>Akun mitra Anda telah dibuat.</p>
        <button class="modal-close-btn" @click="finishRegistration">OK</button>
      </div>
    </div>

    <div v-if="showTermsModal" class="modal-overlay">
      <div class="modal-content terms-modal">
        <h2>Syarat & Ketentuan</h2>
        <div class="terms-scroll-area"><p>...</p></div>
        <button class="modal-close-btn" @click="showTermsModal = false">Tutup</button>
      </div>
    </div>
  </main>
</template>
