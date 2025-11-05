<script setup>
import { ref, computed } from 'vue'

// 1. Impor komponen
import Navbar from '@/components/NavBar.vue'
import PaymentBox from '@/components/PaymentBox.vue'
import FooterPayment from '@/components/FooterPayment.vue'

// 2. Impor CSS
import './Payment.css'

// 3. STATE UTAMA: Biarkan seperti ini (mengontrol radio button)
const selectedOption = ref('bri') // Default-nya kita pilih BRI

// 4. TAMBAHKAN STATE BARU INI: (mengontrol panel accordion)
const openCategory = ref('bank') // Default panel 'bank' terbuka

// Helper untuk memetakan pilihan (Tidak berubah)
const bankOptions = ['bri', 'bni', 'visa', 'mastercard']
const walletOptions = ['gopay', 'ovo']
const qrOptions = ['qris']

// Helper untuk tahu kategori (Tidak berubah, ini untuk button text)
function isCategorySelected(category) {
  if (category === 'bank') return bankOptions.includes(selectedOption.value)
  if (category === 'wallet') return walletOptions.includes(selectedOption.value)
  if (category === 'qr') return qrOptions.includes(selectedOption.value)
  return false
}

// 6. UBAH FUNGSI INI: (Nama & Logikanya)
function toggleCategory(category) {
  if (openCategory.value === category) {
    // Jika panel yang diklik sudah terbuka, tutup panelnya
    openCategory.value = ''
  } else {
    // Jika panel lain (atau tidak ada) yang terbuka, buka panel ini
    openCategory.value = category
  }
}

// 7. COMPUTED PROPERTY (Tidak berubah, sudah benar)
const buttonText = computed(() => {
  if (isCategorySelected('bank')) {
    return 'Bayar Dengan Virtual Account'
  }
  // ... (sisa logikanya sudah benar) ...
  if (isCategorySelected('wallet')) {
    return 'Bayar Dengan E-Wallet'
  }
  if (isCategorySelected('qr')) {
    return 'Bayar Dengan QRIS'
  }
  return 'Pilih Pembayaran' 
})

// 8. FUNGSI HANDLE (Tidak berubah, sudah benar)
function handlePayment() {
  console.log(`Memproses pembayaran dengan: ${selectedOption.value}`)
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

        <div class="method-category">
          <div class="method-header" @click="toggleCategory('bank')">
            <div class="method-info">
              <h3>Transfer Bank</h3>
            </div>
            <span class="method-toggle" v-html="openCategory === 'bank' ? '&#9650;' : '&#9660;'"></span>
          </div>

          <div class="method-content" v-if="openCategory === 'bank'">
            <div class="payment-option-list">
              
              <label class="payment-option" for="method-bri">
                <img src="/img/bri.png" alt="BRI" class="payment-logo">
                <span>Bank BRI</span>
                <input type="radio" id="method-bri" name="paymentOption" value="bri" v-model="selectedOption">
              </label>
              
              <label class="payment-option" for="method-bni">
                <img src="/img/bni.png" alt="BNI" class="payment-logo">
                <span>Bank BNI</span>
                <input type="radio" id="method-bni" name="paymentOption" value="bni" v-model="selectedOption">
              </label>
              
              <label class="payment-option" for="method-visa">
                <img src="/img/VISA.png" alt="Visa" class="payment-logo">
                <span>Visa</span>
                <input type="radio" id="method-visa" name="paymentOption" value="visa" v-model="selectedOption">
              </label>
              
              <label class="payment-option" for="method-mastercard">
                <img src="/img/MASTERCARD.png" alt="Mastercard" class="payment-logo">
                <span>Mastercard</span>
                <input type="radio" id="method-mastercard" name="paymentOption" value="mastercard" v-model="selectedOption">
              </label>
              
            </div>
          </div>
        </div>

        <div class="method-category">
          <div class="method-header" @click="toggleCategory('wallet')">
            <div class="method-info">
              <h3>E-Wallet</h3>
            </div>
            <span class="method-toggle" v-html="openCategory === 'wallet' ? '&#9650;' : '&#9660;'"></span>
          </div>
          <div class="method-content" v-if="openCategory === 'wallet'">
            <div class="payment-option-list">
              
              <label class="payment-option" for="method-gopay">
                <img src="/img/Gopay.png" alt="Gopay" class="payment-logo">
                <span>Gopay</span>
                <input type="radio" id="method-gopay" name="paymentOption" value="gopay" v-model="selectedOption">
              </label>
              
              <label class="payment-option" for="method-ovo">
                <img src="/img/ovo.png" alt="OVO" class="payment-logo">
                <span>OVO</span>
                <input type="radio" id="method-ovo" name="paymentOption" value="ovo" v-model="selectedOption">
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
    variant="button"
    :buttonText="buttonText" 
    @submit="handlePayment"
  />
</template>