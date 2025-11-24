<script setup>
import { ref, onMounted } from 'vue' // Tambah onMounted
import { useRoute } from 'vue-router'
import api from '@/services/api' // Pastikan import API ada

import PaymentBox from '@/components/PaymentBox.vue'
import FooterPayment from '@/components/FooterPayment.vue'
import './PaymentConfirmationView.style.css'

const route = useRoute()

// ==========================================
// 1. Data Setup
// ==========================================
// Ambil parameter dari URL
const orderId = route.query.orderId
const kodeBayar = ref(route.query.paymentCode || '8881081234567890');
const totalHarga = ref(route.query.total || 'Rp 0')
const paymentMethod = ref(route.query.paymentMethod || 'va')
const qrisImage = ref(route.query.qrisImage || '')

// Variable Reactive untuk data Pesanan
const dataBooking = ref(null) // Untuk menyimpan seluruh object data
const nomorPesanan = ref('-')
const lokasi = ref('Memuat lokasi...')
const tanggal = ref('Memuat tanggal...')
const jumlahOrang = ref(0)
const equipmentList = ref([])

// ==========================================
// 2. Fetch Data dari API (Supaya Nomor Pesanan Muncul)
// ==========================================
onMounted(async () => {
  // A. Parsing Equipment dari URL (Logic yang sudah ada)
  try {
    const rawData = route.query.equipment || '[]';
    equipmentList.value = JSON.parse(rawData);
  } catch (error) {
    console.error("Gagal membaca data peralatan:", error);
    equipmentList.value = [];
  }

  // B. Ambil Detail Pesanan dari Backend
  if (orderId) {
    try {
      console.log("Mengambil data konfirmasi untuk ID:", orderId);
      const response = await api.getBookingById(orderId)
      
      if (response.data.success) {
        const data = response.data.data
        dataBooking.value = data // Simpan ke object utama untuk PaymentBox
        
        // Update variable detail agar UI di bawah ikut berubah
        nomorPesanan.value = data.orderNumber || '-'
        lokasi.value = data.placeLocation || '-'
        jumlahOrang.value = data.numPeople || 1
        
        // Format Tanggal
        if (data.startDate) {
          const dateObj = new Date(data.startDate)
          tanggal.value = dateObj.toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
          })
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data pesanan:", error)
    }
  }
})

// ==========================================
// 3. Helper Functions
// ==========================================
function handleCopy() {
  const tempInput = document.createElement('input');
  tempInput.value = kodeBayar.value;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  alert('Kode bayar berhasil disalin!');
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
        :nomorPesanan="dataBooking?.orderNumber || 'Memuat...'"
      />
      
      <section class="confirmation-details-wrapper">
        <h2 class="section-subtitle">Detail Pesanan</h2>
        
        <div class="payment-code-section" v-if="paymentMethod !== 'qris'">
          <span class="code-label">Kode Bayar :</span>
          <span class="code-value">{{ kodeBayar }}</span>
          <button @click="handleCopy" class="copy-button" title="Salin Kode">
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
            </svg>
          </button>
        </div>

        <div class="qris-section" v-else>
          <span class="qris-label">QRIS Code :</span>

          <div class="qris-content-center">
            <img
            :src="`${qrisImage}`"
            alt="QRIS Code"
            class="qris-image"
            />

            <p class="qris-info">
              Scan QR code di atas untuk menyelesaikan pembayaran
            </p>
          </div>
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
                    <span class="info-detail">{{ jumlahOrang }} Orang</span>
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
    :buttonText="'Cek Status Pesanan'"
    nextRoute="/pesanan"
  />
</template>