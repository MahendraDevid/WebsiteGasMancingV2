<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import Navbar from '@/components/NavBar.vue'
import PaymentBox from '@/components/PaymentBox.vue'
import FooterPayment from '@/components/FooterPayment.vue'

import './PaymentView.style.css'

const selectedOption = ref('bri')
const openCategory = ref('bank')

// Router & Route
const route = useRoute()
const router = useRouter()

// Ambil data dari halaman sebelumnya
const totalHarga = ref(route.query.total || 'Rp 0')
// Pastikan equipment diambil sebagai string (kalau undefined jadi string array kosong)
const equipmentString = route.query.equipment || '[]'

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
  if (isCategorySelected('bank')) return 'Bayar Dengan Virtual Account'
  if (isCategorySelected('qr')) return 'Bayar Dengan QRIS'
  return 'Pilih Pembayaran'
})

function handlePayment() {
  console.log(`Memproses pembayaran dengan: ${selectedOption.value}`)

  // Kita oper lagi data yang kita terima ke halaman konfirmasi
  // encodeURIComponent penting agar karakter spesial di JSON tidak merusak URL
  router.push(
    `/paymentconfirmation?total=${encodeURIComponent(totalHarga.value)}&equipment=${encodeURIComponent(equipmentString)}`
  )
}
</script>

<template>
  <Navbar />
  
  <div class="payment-page">
    <main class="payment-content">
      <PaymentBox
        title="Pembayaran"
        :totalPrice="totalHarga" 
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
  
    <div v-if="loading">
        <p>Memuat detail pembayaran...</p>
    </div>
    
    <div v-else-if="order" class="payment-page-container">
        <PaymentBox 
            title="Pembayaran" 
            :totalPrice="order.totalCost" 
            :orderNumber="order.nomor_pesanan" 
        />
        </div>
    
    <div v-else>
        <p>Detail pesanan tidak ditemukan.</p>
    </div>
</template>