<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const currentStep = ref(1);
const showSuccessModal = ref(false);
const showTermsModal = ref(false);

const authStore = useAuthStore();

const facilityOptions = [
  { id: 1, name: 'Toilet' },
  { id: 2, name: 'Musholla' },
  { id: 3, name: 'Parkiran' }
];

const itemTypeOptions = ['Peralatan', 'Umpan', 'Fasilitas Berbayar', 'Lainnya'];
const itemUnitOptions = ['Pcs/Item', 'Kg', 'Bungkus', 'Jam', 'Hari', 'Tiket'];

const formData = reactive({
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
  nama_lengkap: '',
  no_telepon: '',
  email: '',
  password: '',
  nama_bank: 'BCA',
  no_rekening: '',
  atas_nama_rekening: '',
  alamat: '',
  agreedToTerms: false
});

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

const nextStep = () => {
  if (currentStep.value === 1) {
    if (!formData.namaProperti || !formData.alamatProperti) {
      return alert("Mohon lengkapi Nama dan Alamat Properti.");
    }
    if (!formData.alamat) {
      formData.alamat = formData.alamatProperti;
    }
    currentStep.value = 2;
  } else if (currentStep.value === 2) {
    if (!formData.nama_lengkap || !formData.no_telepon || !formData.email || !formData.password) {
      return alert("Mohon lengkapi Data Pemilik (Nama, Email, Password, No HP).");
    }
    currentStep.value = 3;
  }
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
}

async function submitRegistration() {
  if (!formData.agreedToTerms) return alert("Anda harus menyetujui Syarat & Ketentuan.");

  try {
    // === UBAH BAGIAN INI MENJADI FORMDATA ===
    const submissionData = new FormData();

    // Data Pemilik & Akun
    submissionData.append('nama_lengkap', formData.nama_lengkap);
    submissionData.append('email', formData.email);
    submissionData.append('no_telepon', formData.no_telepon);
    submissionData.append('password_hash', formData.password);
    submissionData.append('nama_bank', formData.nama_bank);
    submissionData.append('no_rekening', formData.no_rekening);
    submissionData.append('atas_nama_rekening', formData.atas_nama_rekening);
    submissionData.append('alamat', formData.alamat);

    // Data Properti & Item
    submissionData.append('namaProperti', formData.namaProperti);
    submissionData.append('alamatProperti', formData.alamatProperti);
    submissionData.append('hargaSewa', formData.hargaSewa);
    submissionData.append('satuanSewa', formData.satuanSewa);
    submissionData.append('jamBuka', formData.jamBuka);
    submissionData.append('jamTutup', formData.jamTutup);
    submissionData.append('deskripsi', formData.deskripsi);

    // Pastikan formData.fotoProperti berisi FILE object (bukan string URL)
    if (formData.fotoProperti) {
      submissionData.append('fotoProperti', formData.fotoProperti);
    }

    // FormData tidak bisa kirim array langsung, harus di-stringify dulu
    submissionData.append('fasilitas', JSON.stringify(formData.fasilitas));

    // CATATAN: Upload gambar didalam array items (looping) sangat kompleks.
    // Untuk tahap ini, kita kirim data teks itemnya saja dulu.
    // Gambar item sebaiknya dihandle di fitur "Edit Tempat" nanti.
    submissionData.append('items', JSON.stringify(formData.items));

    // Pastikan di api.js tidak memaksa 'Content-Type': 'application/json'
    // Axios biasanya otomatis mendeteksi FormData dan ganti header jadi 'multipart/form-data'
    const result = await authStore.registerMitra(submissionData);

    if (result.success) {
      console.log("Sukses:", result.message);
      showSuccessModal.value = true;
    } else {
      alert("Gagal: " + result.error);
    }

  } catch (error) {
    console.error("Gagal Daftar:", error);
    alert("Terjadi kesalahan sistem.");
  }
}

function finishRegistration() {
  showSuccessModal.value = false;
  router.push({ name: 'mitra-property' });
}
</script>

<template>
  <main class="registration-page-wrapper">
    <div class="registration-container">

      <div class="stepper-wrapper">
        <div :class="['step-item', { active: currentStep >= 1 }]">
          <div class="step-circle">1</div><span>Properti</span>
        </div>
        <div class="step-line"></div>
        <div :class="['step-item', { active: currentStep >= 2 }]">
          <div class="step-circle">2</div><span>Pemilik</span>
        </div>
        <div class="step-line"></div>
        <div :class="['step-item', { active: currentStep >= 3 }]">
          <div class="step-circle">3</div><span>Konfirmasi</span>
        </div>
      </div>

      <div class="form-card">
        <h2 class="step-title">
          {{ currentStep === 1 ? 'Informasi Properti' : currentStep === 2 ? 'Informasi Pemilik & Akun' : 'KonfirmasiData' }}
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
              <div v-if="!formData.fotoPropertiPreview" class="photo-placeholder"><span>📷</span>
                <p>Klik upload foto</p>
              </div>
              <img v-else :src="formData.fotoPropertiPreview" class="photo-preview-img">
            </div>
          </div>
          <div class="form-group"><label>Deskripsi</label><textarea v-model="formData.deskripsi" rows="2"></textarea>
          </div>
          <div class="form-group"><label>Alamat</label><textarea v-model="formData.alamatProperti" rows="2"></textarea>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Buka</label><input type="time" v-model="formData.jamBuka"></div>
            <div class="form-group"><label>Tutup</label><input type="time" v-model="formData.jamTutup"></div>
          </div>
          <div class="form-row">
            <div class="form-group"><label>Harga</label><input type="number" v-model="formData.hargaSewa"></div>
            <div class="form-group">
              <label>Satuan</label>
              <select v-model="formData.satuanSewa">
                <option>Jam</option>
                <option>Hari</option>
                <option>Tiket</option>
                <option>Kg</option>
              </select>
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
              <div class="item-header">
                <h4>Item #{{ index + 1 }}</h4><button class="btn-remove" @click="removeItem(index)">Hapus</button>
              </div>
              <div class="item-body">
                <div class="item-image-upload">
                  <div class="preview-box"
                    :style="{ backgroundImage: item.image_preview ? `url(${item.image_preview})` : 'none' }"><span
                      v-if="!item.image_preview">+</span></div>
                  <input type="file" accept="image/*" @change="(e) => handleItemImageUpload(e, index)">
                </div>
                <div class="item-inputs">
                  <div class="form-group"><label>Nama</label><input type="text" v-model="item.nama_item"></div>
                  <div class="form-row">
                    <div class="form-group"><label>Harga</label><input type="number" v-model="item.price"></div>
                    <div class="form-group"><label>Satuan</label><select v-model="item.price_unit">
                        <option v-for="o in itemUnitOptions">{{ o }}</option>
                      </select></div>
                  </div>
                  <div class="form-group"><label>Tipe</label><select v-model="item.tipe_item">
                      <option v-for="o in itemTypeOptions">{{ o }}</option>
                    </select></div>
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
            <select v-model="formData.nama_bank">
              <option>BCA</option>
              <option>BRI</option>
              <option>Mandiri</option>
              <option>BNI</option>
              <option>Jago</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group"><label>No. Rekening</label><input type="text" v-model="formData.no_rekening"></div>
            <div class="form-group"><label>Atas Nama</label><input type="text" v-model="formData.atas_nama_rekening">
            </div>
          </div>
        </div>

        <div v-if="currentStep === 3" class="form-step-content confirmation-view">
          <div class="summary-section">
            <h3>🏠 Properti</h3>
            <div class="summary-grid">
              <div class="sum-item"><strong>Nama:</strong> {{ formData.namaProperti }}</div>
              <div class="sum-item"><strong>Alamat:</strong> {{ formData.alamatProperti }}</div>
            </div>
          </div>
          <div class="summary-section">
            <h3>👤 Akun Mitra</h3>
            <div class="summary-grid">
              <div class="sum-item"><strong>Nama:</strong> {{ formData.nama_lengkap }}</div>
              <div class="sum-item"><strong>Email:</strong> {{ formData.email }}</div>
              <div class="sum-item"><strong>Kontak:</strong> {{ formData.no_telepon }}</div>
              <div class="sum-item"><strong>Bank:</strong> {{ formData.nama_bank }} - {{ formData.no_rekening }}
              </div>
            </div>
          </div>
          <div class="agreement-box">
            <label class="checkbox-container">
              <input type="checkbox" v-model="formData.agreedToTerms">
              <span class="checkmark"></span>
              Saya menyetujui <a href="#" @click.prevent="showTermsModal = true">Syarat & Ketentuan</a>.
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

    <div v-if="showTermsModal" class="modal-overlay" @click.self="showTermsModal = false">
      <div class="modal-content terms-modal">
        <h2>Syarat & Ketentuan Mitra</h2>

        <div class="terms-scroll-area">
          <h3>1. Pendahuluan</h3>
          <p>Selamat datang di platform GasMancing. Dengan mendaftar sebagai Mitra, Anda menyetujui seluruh aturan yang berlaku demi kenyamanan bersama antara pemilik kolam dan pemancing.</p>

          <h3>2. Kewajiban Mitra</h3>
          <p>a. Mitra wajib memberikan informasi yang benar, akurat, dan terbaru mengenai lokasi pemancingan, harga, dan fasilitas.</p>
          <p>b. Foto properti yang diunggah harus asli dan tidak melanggar hak cipta pihak lain.</p>
          <p>c. Mitra bertanggung jawab menjaga keamanan dan kenyamanan di lokasi pemancingan fisik.</p>

          <h3>3. Sistem Pemesanan & Pembayaran</h3>
          <p>a. Setiap pesanan yang masuk melalui aplikasi akan diteruskan ke dashboard Mitra.</p>
          <p>b. GasMancing berhak memotong biaya layanan sebesar 5% (dummy) dari setiap transaksi yang berhasil.</p>
          <p>c. Pencairan dana (withdraw) dapat dilakukan setiap hari kerja dengan proses maksimal 1x24 jam.</p>

          <h3>4. Pembatalan & Refund</h3>
          <p>a. Jika pelanggan membatalkan pesanan H-1, dana akan dikembalikan 100% kepada pelanggan.</p>
          <p>b. Jika Mitra membatalkan pesanan secara sepihak tanpa alasan jelas lebih dari 3 kali, akun Mitra dapat dibekukan sementara.</p>

          <h3>5. Larangan</h3>
          <p>Dilarang keras menggunakan platform ini untuk transaksi perjudian, narkoba, atau kegiatan ilegal lainnya sesuai hukum di Indonesia.</p>
        </div>

        <button class="modal-close-btn" @click="showTermsModal = false">Saya Mengerti</button>
      </div>
    </div>
  </main>
</template>

<style scoped src="./MitraRegistration.style.css"></style>
