<script setup>
import { ref, computed, onMounted } from 'vue' // Tambahkan onMounted
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api';

import Navbar from '@/components/NavBar.vue'
import PaymentBox from '@/components/PaymentBox.vue'
import FooterPayment from '@/components/FooterPayment.vue'

import './PaymentView.style.css'

const route = useRoute()
const router = useRouter()

// =======================================================
// Data Status & Inputs
// =======================================================
const submitting = ref(false)
const selectedOption = ref('bri')
const openCategory = ref('bank')

// Ambil data penting dari halaman sebelumnya melalui query params
// ASUMSI: orderId atau bookingId juga dikirim sebagai query parameter
const orderId = route.query.orderId // <--- PENTING: ID PESANAN
const totalHargaString = ref(route.query.total || 'Rp 0') 
const equipmentString = route.query.equipment || '[]'

// Data yang diambil dari API (jika perlu, tapi untuk sekarang kita fokus ke totalCost)
const orderData = ref(null) 

// =======================================================
// Fungsi Utility: Konversi Harga dari String ke Number
// =======================================================
const cleanCurrencyString = (currencyStr) => {
    if (!currencyStr) return 0;
    // Menghapus "Rp", spasi, koma (jika digunakan sebagai pemisah ribuan)
    const cleanStr = currencyStr.replace(/Rp/g, '').replace(/\./g, '').replace(/,/g, '').trim();
    return parseFloat(cleanStr);
};

// =======================================================
// Hitungan dan Pilihan
// =======================================================
const bankOptions = ['bri', 'bni', 'VISA', 'MASTERCARD']
const qrOptions = ['qris']

function isCategorySelected(category) {
  if (category === 'bank') return bankOptions.includes(selectedOption.value)
  if (category === 'qr') return qrOptions.includes(selectedOption.value)
  return false
}

function toggleCategory(category) {
  openCategory.value = openCategory.value === category ? '' : category
}

const buttonText = computed(() => {
  if (submitting.value) return 'Memproses...'
  if (isCategorySelected('bank')) return 'Bayar Dengan Virtual Account'
  if (isCategorySelected('qr')) return 'Bayar Dengan QRIS'
  return 'Pilih Pembayaran'
})

// =======================================================
// FUNGSI UTAMA: Mengirim Data Pembayaran ke Backend
// =======================================================
async function handlePayment() {
  if (submitting.value || !orderId) return
  if (!selectedOption.value) {
    alert('Mohon pilih metode pembayaran terlebih dahulu.')
    return
  }

  submitting.value = true

  // 1. Siapkan Payload
  const paymentAmount = cleanCurrencyString(totalHargaString.value)
  
  if (paymentAmount <= 0) {
      alert('Total biaya tidak valid.')
      submitting.value = false
      return
  }

  const payload = {
    id_pesanan: parseInt(orderId), // Kirim ID Pesanan (harus integer)
    payment_method: selectedOption.value,
    jumlah_bayar: paymentAmount, // Kirim harga dalam bentuk numerik
  }

  try {
    // 2. Panggil API createPayment (POST /api/payment)
    const response = await api.createPayment(payload)

    const paymentData = response.data.data
    
    // 3. Sukses: Redirect ke halaman konfirmasi dengan data pembayaran
    router.push({
      path: '/paymentconfirmation',
      query: {
        orderId: orderId,
        paymentCode: paymentData.kode_bayar, // Kode bayar dari backend
        paymentMethod: selectedOption.value,
        qrisImage: paymentData.image_qris, // URL QRIS dari backend (simulasi)
        total: totalHargaString.value,
        equipment: equipmentString
      }
    })

  } catch (error) {
    console.error('Gagal membuat pembayaran:', error.response?.data || error)
    alert('Gagal memproses pembayaran. Silakan coba lagi. Pastikan ID pesanan sudah benar dan belum lunas.')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  
  <div class="payment-page">
    <main class="payment-content">
      <PaymentBox
        title="Pembayaran"
        :totalPrice="totalHargaString" 
      />

      <section class="payment-methods">
        <h2 class="methods-title">Metode Pembayaran</h2>

        <div class="method-category">
          <div class="method-header" @click="toggleCategory('bank')">
            <div class="method-info">
              <h3>Virtual Account</h3>
            </div>
            <span class="method-toggle" v-html="openCategory === 'bank' ? '&#9650;' : '&#9660;'"></span>
          </div>

          <div class="method-content" v-if="openCategory === 'bank'">
            <div class="payment-option-list">
              <label class="payment-option" v-for="bank in bankOptions" :key="bank">
                <img :src="`/img/${bank}.png`" :alt="bank" class="payment-logo">
                <span>{{ bank.toUpperCase() }}</span>
                <input type="radio" name="paymentOption" :value="bank" v-model="selectedOption">
              </label>
            </div>
          </div>
        </div>

        <div class="method-category">
          <div class="method-header" @click="toggleCategory('qr')">
            <div class="method-info">
              <h3>QR Code</h3>
            </div>
            <span class="method-toggle" v-html="openCategory === 'qr' ? '&#9650;' : '&#9660;'"></span>
          </div>

          <div class="method-content" v-if="openCategory === 'qr'">
            <div class="payment-option-list">
              <label class="payment-option" for="method-qris">
                <img src="/img/qris.png" alt="QRIS" class="payment-logo">
                <span>QRIS</span>
                <input type="radio" id="method-qris" name="paymentOption" value="qris" v-model="selectedOption">
              </label>
            </div>
          </div>
        </div>

      </section>
    </main>
  </div>
  
  <FooterPayment 
    :buttonText="buttonText" 
    @click-action="handlePayment" 
  />
</template>