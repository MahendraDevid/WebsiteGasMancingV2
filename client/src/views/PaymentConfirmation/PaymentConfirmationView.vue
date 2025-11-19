<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

import Navbar from '@/components/NavBar.vue'
import PaymentBox from '@/components/PaymentBox.vue'
import FooterPayment from '@/components/FooterPayment.vue'
import './PaymentConfirmationView.style.css'

const route = useRoute()

// Data dari query
const kodeBayar = ref('8881081234567890');
const totalHarga = ref(route.query.total || 'Rp 0')
const nomorPesanan = ref(42);
const lokasi = ref('Ancol, Jakarta barat');
const tanggal = ref('12 Desember 2025');
const jumlahOrang = ref(1);

// --- PERBAIKAN PARSING DATA PERALATAN ---
const equipmentList = ref([]);

try {
  // Ambil string dari URL, kalau kosong default ke "[]"
  const rawData = route.query.equipment || '[]';
  // Ubah string JSON menjadi Array Object
  equipmentList.value = JSON.parse(rawData);
} catch (error) {
  console.error("Gagal membaca data peralatan:", error);
  equipmentList.value = [];
}

function handleCopy() {
  const tempInput = document.createElement('input');
  tempInput.value = kodeBayar.value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  // Bisa diganti dengan alert atau toast notifikasi
  alert('Kode bayar berhasil disalin!');
}

function handleConfirmation() {
  console.log('Proses pembayaran dikonfirmasi!');
}
</script>

<template>
  <Navbar />
  
  <div class="confirmation-page-wrapper">
    <main class="confirmation-content-box">
      <h1 class="page-title">Konfirmasi Pembayaran</h1>
      
      <PaymentBox
        title=""
        :totalPrice="totalHarga" 
        :orderNumber="nomorPesanan" 
      />
      
      <section class="confirmation-details-wrapper">
        <h2 class="section-subtitle">Konfirmasi Pembayaran</h2>
        
        <div class="payment-code-section">
          <span class="code-label">Kode Bayar :</span>
          <span class="code-value">{{ kodeBayar }}</span>
          <button @click="handleCopy" class="copy-button" title="Salin Kode">
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
        </div>

        <div class="rental-info-container">
            <div class="location-date-person">
                <div class="info-item">
                    <div class="icon-wrapper">
                         <img src="/img/iconlokasi.png" class="detail-img" alt="Lokasi">
                    </div> 
                    <span class="info-label">Lokasi</span>
                    <span class="info-detail">{{ lokasi }}</span>
                </div>
                
                <div class="info-item">
                    <div class="icon-wrapper">
                        <img src="/img/calendar.png" class="detail-img" alt="Tanggal">
                    </div> 
                    <span class="info-label">Tanggal</span>
                    <span class="info-detail">{{ tanggal }}</span>
                </div>
                
                <div class="info-item">
                    <div class="icon-wrapper">
                        <img src="/img/people.png" class="detail-img-large" alt="Orang">
                    </div>
                    <span class="info-label">Orang</span>
                    <span class="info-detail">{{ jumlahOrang }}</span>
                </div>
            </div>

            <div class="rented-items-box">
                <h3 class="items-title">Peralatan yang Disewa :</h3>
                
                <div v-if="equipmentList.length > 0" class="item-list">
                    <span v-for="(item, index) in equipmentList" :key="index" class="item-tag">
                      <b>{{ item.qty }}x</b> {{ item.name }}
                    </span>
                </div>
                
                <p v-else class="no-equipment-text"><em>Tidak ada peralatan yang dipilih</em></p>
            </div>
        </div>
      </section>
    </main>
  </div>
  
  <FooterPayment
    variant="checkout"
    :leftTitle="'Total'"
    :leftSubtitle="totalHarga"
    :buttonText="'Bayar Sekarang'"
    nextRoute="/pesanan"
  />
</template>