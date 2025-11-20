<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import './MitraRegistration.style.css'; // Pastikan file CSS sudah diupdate dengan kode sebelumnya

const router = useRouter();
const currentStep = ref(1);
const showSuccessModal = ref(false);
const showTermsModal = ref(false); // State untuk Modal S&K

// --- Opsi Data Statis (Sesuai Database) ---
const facilityOptions = [
  { id: 1, name: 'Toilet' },
  { id: 2, name: 'Musholla' },
  { id: 3, name: 'Parkiran' }
];

// Opsi Dropdown Item
const itemTypeOptions = ['Peralatan', 'Umpan', 'Fasilitas Berbayar', 'Lainnya'];
const itemUnitOptions = ['Pcs/Item', 'Kg', 'Bungkus', 'Jam', 'Hari', 'Tiket'];

// --- Main Form Data ---
const formData = reactive({
  // Step 1: Properti
  namaProperti: '',

  // UPDATE: Deskripsi & Foto Utama
  deskripsi: '',
  fotoProperti: null,        // File Object (untuk dikirim ke backend nanti)
  fotoPropertiPreview: null, // URL Blob (untuk preview di layar)

  alamatProperti: '',
  jamBuka: '',
  jamTutup: '',
  hargaSewa: '',
  satuanSewa: 'Jam',

  // PR1: Fasilitas (Array ID)
  fasilitas: [],

  // PR2: Item/Peralatan Dinamis (Array of Objects)
  items: [],

  // Step 2: Pemilik
  namaPemilik: '',
  noHp: '',
  email: '',
  namaBank: 'BCA',
  noRekening: '',
  atasNamaRekening: '',

  // Step 3: Agreement
  agreedToTerms: false
});

// --- Logic Upload Foto Properti Utama ---
const handlePropertyPhotoUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.fotoProperti = file;
    formData.fotoPropertiPreview = URL.createObjectURL(file);
  }
};

// --- Logic Peralatan Dinamis (PR2) ---
const addItem = () => {
  formData.items.push({
    nama_item: '',
    price: '',
    price_unit: 'Pcs/Item', // Default
    tipe_item: 'Peralatan', // Default
    image_file: null,
    image_preview: null
  });
};

const removeItem = (index) => {
  formData.items.splice(index, 1);
};

const handleItemImageUpload = (event, index) => {
  const file = event.target.files[0];
  if (file) {
    formData.items[index].image_file = file;
    formData.items[index].image_preview = URL.createObjectURL(file);
  }
};

// --- Helper Functions ---
const getFacilityNames = () => {
  return facilityOptions
    .filter(opt => formData.fasilitas.includes(opt.id))
    .map(opt => opt.name)
    .join(', ');
};

const formatRupiah = (number) => {
  if (!number) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
};

// --- Navigasi Step ---
function nextStep() {
  if (currentStep.value === 1) {
    // Validasi sederhana Step 1
    if (!formData.namaProperti || !formData.alamatProperti) {
      return alert("Mohon lengkapi Nama dan Alamat Properti.");
    }
    currentStep.value = 2;
  } else if (currentStep.value === 2) {
    // Validasi sederhana Step 2
    if (!formData.namaPemilik || !formData.noHp) {
      return alert("Mohon lengkapi Data Pemilik.");
    }
    currentStep.value = 3;
  }
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--;
}

function submitRegistration() {
  if (!formData.agreedToTerms) return alert("Anda harus menyetujui Syarat & Ketentuan.");

  // Di sini nanti proses kirim ke API Backend
  console.log("Data Final Pendaftaran:", formData);
  showSuccessModal.value = true;
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
        <div :class="['step-item', { active: currentStep >= 1 }]">
          <div class="step-circle">1</div><span>Properti & Alat</span>
        </div>
        <div class="step-line"></div>
        <div :class="['step-item', { active: currentStep >= 2 }]">
          <div class="step-circle">2</div><span>Info Pemilik</span>
        </div>
        <div class="step-line"></div>
        <div :class="['step-item', { active: currentStep >= 3 }]">
          <div class="step-circle">3</div><span>Konfirmasi</span>
        </div>
      </div>

      <div class="form-card">
        <h2 class="step-title">
          {{ currentStep === 1 ? 'Informasi Properti & Item' : currentStep === 2 ? 'Informasi Pemilik & Pembayaran' : 'Konfirmasi Data' }}
        </h2>

        <div v-if="currentStep === 1" class="form-step-content">

          <div class="form-group">
            <label>Nama Pemancingan / Properti</label>
            <input type="text" v-model="formData.namaProperti" placeholder="Contoh: Pemancingan Telaga Biru">
          </div>

          <div class="form-group">
            <label>Foto Lokasi Utama</label>
            <div class="property-photo-uploader">
              <input type="file" accept="image/*" @change="handlePropertyPhotoUpload">

              <div v-if="!formData.fotoPropertiPreview" class="photo-placeholder">
                <span>📷</span>
                <p>Klik untuk upload foto lokasi</p>
              </div>

              <img v-else :src="formData.fotoPropertiPreview" class="photo-preview-img" alt="Preview Properti">
            </div>
          </div>

          <div class="form-group">
            <label>Deskripsi Singkat</label>
            <textarea v-model="formData.deskripsi" rows="3" placeholder="Jelaskan keunggulan, suasana, atau jenis ikan yang ada..."></textarea>
          </div>

          <div class="form-group">
            <label>Alamat Lengkap</label>
            <textarea v-model="formData.alamatProperti" rows="2" placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan..."></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Jam Buka</label>
              <input type="time" v-model="formData.jamBuka">
            </div>
            <div class="form-group">
              <label>Jam Tutup</label>
              <input type="time" v-model="formData.jamTutup">
            </div>
          </div>

          <div class="form-row">
             <div class="form-group">
              <label>Harga Tiket / Sewa Dasar</label>
              <input type="number" v-model="formData.hargaSewa" placeholder="Rp">
            </div>
             <div class="form-group">
              <label>Satuan</label>
              <select v-model="formData.satuanSewa">
                <option>Jam</option>
                <option>Hari</option>
                <option>Tiket Masuk</option>
                <option>Kg</option>
              </select>
            </div>
          </div>
          <div class="divider">Fasilitas Tersedia</div>
          <br>
          <div class="checkbox-grid">
            <label v-for="fac in facilityOptions" :key="fac.id" class="checkbox-card">
              <input type="checkbox" :value="fac.id" v-model="formData.fasilitas">
              <span>{{ fac.name }}</span>
            </label>
          </div>

          <div class="divider">Item Penyewaan & Penjualan</div>
          <br>
          <p class="info-text">Tambahkan peralatan pancing, umpan, sewa saung, atau item lain yang Anda tawarkan.</p>

          <div class="items-container">
            <div v-for="(item, index) in formData.items" :key="index" class="item-card">
              <div class="item-header">
                <h4>Item #{{ index + 1 }}</h4>
                <button class="btn-remove" @click="removeItem(index)">Hapus</button>
              </div>

              <div class="item-body">
                <div class="item-image-upload">
                  <div class="preview-box" :style="{ backgroundImage: item.image_preview ? `url(${item.image_preview})` : 'none' }">
                    <span v-if="!item.image_preview">+ Foto</span>
                  </div>
                  <input type="file" accept="image/*" @change="(e) => handleItemImageUpload(e, index)">
                </div>

                <div class="item-inputs">
                  <div class="form-group">
                    <label>Nama Item</label>
                    <input type="text" v-model="item.nama_item" placeholder="Contoh: Joran Fiber / Pelet Udang">
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label>Harga (Rp)</label>
                      <input type="number" v-model="item.price">
                    </div>
                    <div class="form-group">
                      <label>Satuan</label>
                      <select v-model="item.price_unit">
                        <option v-for="opt in itemUnitOptions" :key="opt">{{ opt }}</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Tipe Kategori</label>
                    <select v-model="item.tipe_item">
                      <option v-for="opt in itemTypeOptions" :key="opt">{{ opt }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <button class="btn-add-item" @click="addItem">
              + Tambah Peralatan / Item Baru
            </button>
          </div>
        </div>

        <div v-if="currentStep === 2" class="form-step-content">
          <div class="form-group">
            <label>Nama Lengkap Pemilik</label>
            <input type="text" v-model="formData.namaPemilik" placeholder="Sesuai KTP">
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Nomor WhatsApp</label>
              <input type="tel" v-model="formData.noHp">
            </div>
            <div class="form-group">
              <label>Email (Opsional)</label>
              <input type="email" v-model="formData.email">
            </div>
          </div>

          <div class="divider">Informasi Rekening</div>
          <br>
          <div class="form-group">
            <label>Bank</label>
            <select v-model="formData.namaBank">
              <option>BCA</option>
              <option>BRI</option>
              <option>Mandiri</option>
              <option>BNI</option>
              <option>Jago</option>
              <option>Lainnya</option>
            </select>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>No. Rekening</label>
              <input type="text" v-model="formData.noRekening">
            </div>
            <div class="form-group">
              <label>Atas Nama</label>
              <input type="text" v-model="formData.atasNamaRekening">
            </div>
          </div>
        </div>

        <div v-if="currentStep === 3" class="form-step-content confirmation-view">

          <div class="summary-section">
            <h3>🏠 Informasi Properti</h3>

            <div v-if="formData.fotoPropertiPreview" style="margin-bottom: 15px;">
              <img :src="formData.fotoPropertiPreview" style="width:100%; height: 220px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;">
            </div>

            <div class="summary-grid">
              <div class="sum-item full"><strong>Nama:</strong> {{ formData.namaProperti }}</div>
              <div class="sum-item full"><strong>Deskripsi:</strong> {{ formData.deskripsi || '-' }}</div>

              <div class="sum-item"><strong>Alamat:</strong> {{ formData.alamatProperti }}</div>
              <div class="sum-item"><strong>Jam Operasional:</strong> {{ formData.jamBuka }} - {{ formData.jamTutup }}</div>
              <div class="sum-item"><strong>Harga Dasar:</strong> {{ formatRupiah(formData.hargaSewa) }} / {{ formData.satuanSewa }}</div>
              <div class="sum-item full"><strong>Fasilitas:</strong> {{ getFacilityNames() || 'Tidak ada fasilitas dipilih' }}</div>
            </div>
          </div>

          <div class="summary-section">
            <h3>🎣 Peralatan & Item Tambahan ({{ formData.items.length }})</h3>
            <div v-if="formData.items.length === 0" class="empty-msg">Tidak ada item tambahan.</div>
            <div class="summary-items-list">
              <div v-for="(item, idx) in formData.items" :key="idx" class="sum-item-row">
                <div class="sum-img-thumb" :style="{ backgroundImage: item.image_preview ? `url(${item.image_preview})` : '' }"></div>
                <div class="sum-item-detail">
                  <strong>{{ item.nama_item }}</strong>
                  <span class="badge-type">{{ item.tipe_item }}</span>
                  <p>{{ formatRupiah(item.price) }} / {{ item.price_unit }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="summary-section">
            <h3>👤 Pemilik & Pembayaran</h3>
            <div class="summary-grid">
              <div class="sum-item"><strong>Nama:</strong> {{ formData.namaPemilik }}</div>
              <div class="sum-item"><strong>Kontak:</strong> {{ formData.noHp }}</div>
              <div class="sum-item"><strong>Email:</strong> {{ formData.email || '-' }}</div>
              <div class="sum-item full"><strong>Bank:</strong> {{ formData.namaBank }} - {{ formData.noRekening }} <br> (a.n {{ formData.atasNamaRekening }})</div>
            </div>
          </div>

          <div class="agreement-box">
            <label class="checkbox-container">
              <input type="checkbox" v-model="formData.agreedToTerms">
              <span class="checkmark"></span>
              <span class="agreement-text">
                Saya menyatakan data di atas benar dan menyetujui
                <a href="#" @click.prevent="showTermsModal = true">Syarat & Ketentuan Kontrak Mitra</a>.
              </span>
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
        <div class="success-icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="check-icon"><polyline points="20 6 9 17 4 12"></polyline></svg>
        </div>
        <h2>Pendaftaran Berhasil!</h2>
        <p>Data Anda telah kami terima. Silakan tunggu verifikasi admin.</p>
        <button class="modal-close-btn" @click="finishRegistration">OK</button>
      </div>
    </div>

    <div v-if="showTermsModal" class="modal-overlay">
      <div class="modal-content terms-modal">
        <h2>Syarat & Ketentuan Mitra</h2>
        <div class="terms-scroll-area">
          <h3>1. Pendaftaran Properti</h3>
          <p>Mitra wajib memberikan informasi yang akurat, foto asli, dan deskripsi terkini mengenai properti yang didaftarkan. Pemalsuan data akan berakibat pada pemblokiran akun.</p>

          <h3>2. Sistem Pembayaran</h3>
          <p>Pembayaran dari penyewa akan ditampung oleh Aplikasi (Rekber) dan diteruskan ke Mitra maksimal 1x24 jam setelah pesanan selesai (H+1).</p>

          <h3>3. Kebijakan Peralatan</h3>
          <p>Kerusakan peralatan yang disewa menjadi tanggung jawab penyewa sesuai dengan bukti fisik yang ada. Mitra wajib menyediakan peralatan dalam kondisi layak pakai.</p>

          <h3>4. Biaya Layanan</h3>
          <p>Aplikasi mengenakan biaya layanan (Platform Fee) sebesar 5% dari setiap transaksi yang berhasil dilakukan melalui sistem kami.</p>

          <h3>5. Pembatalan & Sanksi</h3>
          <p>Mitra tidak diperkenankan membatalkan pesanan secara sepihak tanpa alasan darurat. Pembatalan sepihak berulang dapat menurunkan rating performa toko.</p>
        </div>
        <button class="modal-close-btn" @click="showTermsModal = false">Saya Mengerti</button>
      </div>
    </div>

  </main>
</template>
