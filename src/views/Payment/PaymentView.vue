<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 1. Impor komponen
import Navbar from '@/components/NavBar.vue'
import PaymentBox from '@/components/PaymentBox.vue'
import FooterPayment from '@/components/FooterPayment.vue'

// 2. Impor CSS
import './PaymentView.style.css'

// 3. STATE UTAMA: (radio button)
const selectedOption = ref('bri')

// 4. STATE PANEL TERBUKA
const openCategory = ref('bank')

// Router & Route
const route = useRoute()
const router = useRouter()
console.log(route.query.total)

// 5. Helper kategori
const bankOptions = ['bri', 'bni', 'VISA', 'MASTERCARD']
const walletOptions = ['Gopay', 'ovo']
const qrOptions = ['qris']

function isCategorySelected(category) {
  if (category === 'bank') return bankOptions.includes(selectedOption.value)
  if (category === 'wallet') return walletOptions.includes(selectedOption.value)
  if (category === 'qr') return qrOptions.includes(selectedOption.value)
  return false
}

// 6. Accordion toggle
function toggleCategory(category) {
  openCategory.value = openCategory.value === category ? '' : category
}

// 7. Tombol bayar
const buttonText = computed(() => {
  if (isCategorySelected('bank')) return 'Bayar Dengan Virtual Account'
  if (isCategorySelected('wallet')) return 'Bayar Dengan E-Wallet'
  if (isCategorySelected('qr')) return 'Bayar Dengan QRIS'
  return 'Pilih Pembayaran'
})

// 8. 🔹 HANDLE PAYMENT — tambahkan navigasi ke PaymentConfirmation
function handlePayment() {
  console.log(`Memproses pembayaran dengan: ${selectedOption.value}`)

  // Setelah user klik tombol Bayar → arahkan ke halaman konfirmasi
  router.push('/paymentconfirmation')
}
</script>

<template>
  <Navbar />
  
  <div class="payment-page">
    <main class="payment-content">
      <PaymentBox
        title="Pembayaran"
        totalPrice="Rp. 1.999.009,-" 
      />

      <section class="payment-methods">
        <h2 class="methods-title">Metode Pembayaran</h2>

        <!-- === KATEGORI BANK === -->
        <div class="method-category">
          <div class="method-header" @click="toggleCategory('bank')">
            <div class="method-info">
              <h3>Transfer Bank</h3>
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

        <!-- === KATEGORI WALLET === -->
        <div class="method-category">
          <div class="method-header" @click="toggleCategory('wallet')">
            <div class="method-info">
              <h3>E-Wallet</h3>
            </div>
            <span class="method-toggle" v-html="openCategory === 'wallet' ? '&#9650;' : '&#9660;'"></span>
          </div>

          <div class="method-content" v-if="openCategory === 'wallet'">
            <div class="payment-option-list">
              <label class="payment-option" v-for="wallet in walletOptions" :key="wallet">
                <img :src="`/img/${wallet}.png`" :alt="wallet" class="payment-logo">
                <span>{{ wallet.toUpperCase() }}</span>
                <input type="radio" name="paymentOption" :value="wallet" v-model="selectedOption">
              </label>
            </div>
          </div>
        </div>

        <!-- === KATEGORI QR === -->
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
    variant="button"
    :buttonText="buttonText"
    @submit="handlePayment"
  />
</template>
