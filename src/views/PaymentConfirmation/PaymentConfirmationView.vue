<script setup>
import { ref } from 'vue'

// 1. Impor komponen yang dibutuhkan
import Navbar from '@/components/NavBar.vue'
import PaymentBox from '@/components/PaymentBox.vue' // Menggunakan komponen kotak ringkasan yang sama
import FooterPayment from '@/components/FooterPayment.vue'

// 2. Impor CSS spesifik halaman ini
import './PaymentConfirmationView.style.css'

// Data Dummy (diasumsikan diambil dari API di aplikasi nyata)
const kodeBayar = ref('8881081234567890');
const totalHarga = ref('Rp. 1.999.009,-');
const nomorPesanan = ref(42);
const lokasi = ref('Ancol, Jakarta barat');
const tanggal = ref('12 Desember 2025');
const jumlahOrang = ref(1);
const peralatanDisewa = ref([
    'Pancingan', 'Pancingan', 'Pancingan', 'Pancingan',
    'Pancingan', 'Pancingan', 'Pancingan', 'Pancingan',
]);

function handleCopy() {
    // Menggunakan document.execCommand('copy') untuk menyalin teks
    const tempInput = document.createElement('input');
    tempInput.value = kodeBayar.value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    console.log('Kode bayar berhasil disalin!');
}

function handleConfirmation() {
    console.log('Proses pembayaran dikonfirmasi!');
}

</script>

<template>
  <Navbar />
  
  <div class="confirmation-page-wrapper">
    <main class="confirmation-content-box">
      <!-- PERBAIKAN: Judul Halaman di luar kotak -->
      <h1 class="page-title">Konfirmasi Pembayaran</h1>
      
      <!-- PaymentBox HANYA berisi Harga/Nomor Pesanan -->
      <PaymentBox
        title=""
        :totalPrice="totalHarga" 
        :orderNumber="nomorPesanan" 
      />
      
      <!-- Detail Konfirmasi (Kotak Putih Bawah) -->
      <section class="confirmation-details-wrapper">
        <h2 class="section-subtitle">Konfirmasi Pembayaran</h2>
        
        <!-- Bagian Kode Bayar -->
        <div class="payment-code-section">
          <span class="code-label">Kode Bayar :</span>
          <span class="code-value">{{ kodeBayar }}</span>
          <button @click="handleCopy" class="copy-button" title="Salin Kode">
            <!-- Icon Salin (SVG) -->
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
        </div>

        <div class="rental-info-container">
            <!-- Lokasi, Tanggal, Orang -->
            <div class="location-date-person">
                
                <!-- LOKASI -->
                <div class="info-item">
                    <!-- Menggunakan IMG tag, dibungkus agar center -->
                    <div class="icon-wrapper">
                         <img src="/img/iconlokasi.png" class="detail-img" alt="Lokasi">
                    </div> 
                    <span class="info-label">Lokasi</span>
                    <span class="info-detail">{{ lokasi }}</span>
                </div>
                
                <!-- TANGGAL -->
                <div class="info-item">
                    <div class="icon-wrapper">
                        <img src="/img/calendar.png" class="detail-img" alt="Tanggal">
                    </div> 
                    <span class="info-label">Tanggal</span>
                    <span class="info-detail">{{ tanggal }}</span>
                </div>
                
                <!-- ORANG -->
                <div class="info-item">
                    <div class="icon-wrapper">
                        <!-- Ukuran icon People dibuat 40x40 di sini -->
                        <img src="/img/people.png" class="detail-img-large" alt="Orang">
                    </div>
                    <span class="info-label">Orang</span>
                    <span class="info-detail">{{ jumlahOrang }}</span>
                </div>
            </div>

            <!-- Peralatan yang Disewa -->
            <div class="rented-items-box">
                <h3 class="items-title">Peralatan yang Disewa :</h3>
                <div class="item-list">
                    <span v-for="(item, index) in peralatanDisewa" :key="index" class="item-tag">
                        {{ item }}
                    </span>
                </div>
            </div>
        </div>
      </section>
    </main>
  </div>
  
  <!-- Footer pembayaran -->
    <FooterPayment
      variant="checkout"
      :leftTitle="'Total'"
      :leftSubtitle="'Rp 120.000'"
      :buttonText="'Bayar Sekarang'"
      nextRoute="/pesanan"/>
</template>

<style scoped>
/* Import CSS dari file terpisah */
@import './PaymentConfirmationView.style.css'; 

/* STYLE KHUSUS UNTUK JUDUL H-1 DI HALAMAN INI */
.page-title {
    font-family: "SF Pro-Semibold", Helvetica;
    font-size: 24px; 
    color: #141414;
    font-weight: 600;
    margin-bottom: 5px; 
    margin-top: 0; 
}

/* Style Ikon */
.copy-button {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 5px; 
    display: flex;
    align-items: center;
}
.copy-icon {
    width: 18px; 
    height: 18px;
    color: #4A5568; 
}

/* Icon Lokasi/Tanggal */
.detail-img {
    width: 28px;
    height: 28px;
    object-fit: contain;
}
/* Icon Orang (Jika ukurannya berbeda) */
.detail-img-large {
    width: 32px; /* Dibuat sedikit lebih besar */
    height: 32px;
    object-fit: contain;
}
.icon-wrapper {
    /* Container untuk icon */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
    height: 35px; /* Memberi ruang seragam untuk semua ikon */
}

</style>