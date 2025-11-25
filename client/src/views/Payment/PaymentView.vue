<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import PaymentBox from '@/components/PaymentBox.vue'
import FooterPayment from '@/components/FooterPayment.vue'

const route = useRoute()
const router = useRouter()

const submitting = ref(false)
const selectedOption = ref('bri')
const openCategory = ref('bank')

// Ambil parameter dari URL
const orderId = route.query.orderId
const totalHargaString = ref(route.query.total || 'Rp 0')
const equipmentString = route.query.equipment || '[]'

// 1. Variabel Data Booking (Reactive)
const dataBooking = ref(null)

onMounted(async () => {
  if (orderId) {
    try {
      console.log("Mencari Order ID:", orderId);
      const response = await api.getBookingById(orderId)

      if (response.data.success) {
        console.log("Data Ditemukan:", response.data.data);

        dataBooking.value = response.data.data

        if (response.data.data.totalCost) {
          const numericPrice = parseFloat(response.data.data.totalCost);
          totalHargaString.value = 'Rp ' + numericPrice.toLocaleString('id-ID');
        }


      }
    } catch (error) {
      console.error("Gagal mengambil detail pesanan:", error)
    }
  }
})

const cleanCurrencyString = (currencyStr) => {
  if (!currencyStr) return 0;
  const cleanStr = currencyStr.replace(/Rp/g, '').replace(/\./g, '').replace(/,/g, '').trim();
  return parseFloat(cleanStr);
};

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

async function handlePayment() {
  if (submitting.value || !orderId) return
  if (!selectedOption.value) {
    alert('Mohon pilih metode pembayaran terlebih dahulu.')
    return
  }

  submitting.value = true
  const paymentAmount = cleanCurrencyString(totalHargaString.value)

  if (paymentAmount <= 0) {
    alert('Total biaya tidak valid.')
    submitting.value = false
    return
  }

  const payload = {
    id_pesanan: parseInt(orderId),
    payment_method: selectedOption.value,
    jumlah_bayar: paymentAmount,
  }

  try {
    const response = await api.createPayment(payload)
    const paymentData = response.data.data

    router.push({
      path: '/paymentconfirmation',
      query: {
        orderId: orderId,
        paymentCode: paymentData.kode_bayar,
        paymentMethod: selectedOption.value,
        qrisImage: paymentData.image_qris,
        total: totalHargaString.value,
        equipment: equipmentString
      }
    })

  } catch (error) {
    console.error('Gagal membuat pembayaran:', error.response?.data || error)
    const msg = error.response?.data?.message || 'Gagal memproses pembayaran.'
    alert(msg)
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="payment-page">
    <main class="payment-content">

      <PaymentBox title="Pembayaran" :totalPrice="totalHargaString"
        :nomorPesanan="dataBooking?.orderNumber || 'Memuat...'" />

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

  <FooterPayment :buttonText="buttonText" @click-action="handlePayment" />
</template>

<style scoped src="./PaymentView.style.css"></style>