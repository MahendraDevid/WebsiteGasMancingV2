<template>
  <div class="payment-box-wrapper">

    <!-- 2. Bagian Timer (Batas Waktu) -->
    <section class="payment-timer-section">
      <div class="timer-header">
        <span>Selesaikan Pembayaran Dalam</span>
        <!-- Tampilkan status jika 'Menunggu Pembayaran' -->
        <span v-if="order.status === 'Menunggu Pembayaran'" class="timer-countdown">{{ timerDisplay }}</span>
        <!-- Tampilkan status jika sudah 'Lunas' -->
        <span v-else class="timer-lunas">Sudah Lunas</span>
      </div>
      <div class="total-price">
        <span>Total Pembayaran</span>
        <strong>{{ order.totalPrice }}</strong>
      </div>
    </section>

    <!-- 3. Bagian Metode Pembayaran (VA) -->
    <section class="payment-method-section">
      <h3>Metode Pembayaran</h3>
      <div class="method-box">
        <img src="/img/bri.png" alt="Bank BCA" class="bank-logo" onerror="this.src='https://placehold.co/100x30/00308F/FFFFFF?text=BCA'">
        <div class="va-details">
          <span>Nomor Virtual Account</span>
          <strong>{{ order.kodeBayar }}</strong>
        </div>
        <button @click="handleCopy(order.kodeBayar)" class="copy-button" title="Salin Kode">
          <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>
      </div>
    </section>

    <!-- 4. Bagian Rincian Pesanan (yang "lain2") -->
    <section class="order-details-section">
      <h3>Rincian Pesanan</h3>
      <div class="info-item">
        <span class="info-label">Nomor Pesanan</span>
        <span class="info-detail">{{ order.nomorPesanan }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Lokasi</span>
        <span class="info-detail">{{ order.location }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Tanggal</span>
        <span class="info-detail">{{ order.orderDate }}</span>
      </div>
      <div class="info-item">
        <span class="info-label">Orang</span>
        <span class="info-detail">{{ order.numPeople }}</span>
      </div>
      <div class="info-item items-rented">
        <span class="info-label">Peralatan</span>
        <div class="info-detail">
          <div v-if="order.rentedEquipment.length > 0 && order.rentedEquipment[0] !== 'Tidak ada'" class="item-list">
            <span v-for="(item, index) in order.rentedEquipment" :key="index" class="item-tag">
              {{ item }}
            </span>
          </div>
          <span v-else><em>Tidak ada peralatan</em></span>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

// 1. Terima SELURUH data 'order' sebagai prop
const props = defineProps({
  order: {
    type: Object,
    required: true
  }
});

// --- LOGIKA TIMER ---
// Atur timer 24 jam (dalam detik)
const timeLeft = ref(24 * 60 * 60); 
const intervalId = ref(null);

// Format waktu menjadi HH:MM:SS
const timerDisplay = computed(() => {
  const hours = Math.floor(timeLeft.value / 3600);
  const minutes = Math.floor((timeLeft.value % 3600) / 60);
  const seconds = timeLeft.value % 60;
  
  // Format '09' bukan '9'
  const f = (n) => (n < 10 ? '0' + n : n); 
  
  return `${f(hours)}:${f(minutes)}:${f(seconds)}`;
});

const startTimer = () => {
  // Hanya jalankan timer jika statusnya belum lunas
  if (props.order.status !== 'Lunas') {
    intervalId.value = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        clearInterval(intervalId.value);
        // Di sini Anda bisa emit event 'paymentExpired'
      }
    }, 1000); // 1 detik
  }
};

// Mulai timer saat komponen dimuat
onMounted(startTimer);
// Hentikan timer saat komponen dihancurkan (pindah halaman)
onBeforeUnmount(() => {
  clearInterval(intervalId.value);
});

// --- LOGIKA KOPY ---
function handleCopy(textToCopy) {
  const tempInput = document.createElement('input');
  tempInput.value = textToCopy;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
  
  console.log('Berhasil disalin:', textToCopy);
  // Anda bisa tambahkan notifikasi "Berhasil disalin" di sini
}
</script>

<style scoped>
/* Style baru untuk PaymentBox yang lengkap */
.payment-box-wrapper {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  margin-bottom: 20px;
}

/* 2. Bagian Timer */
.payment-timer-section {
  padding: 25px;
  border-bottom: 1px dashed #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.timer-header span {
  display: block;
  font-size: 15px;
  color: #666;
}
.timer-countdown {
  font-size: 24px;
  font-weight: 700;
  color: #d9534f; /* Merah */
  margin-top: 5px;
}
.timer-lunas {
  font-size: 20px;
  font-weight: 700;
  color: #5cb85c; /* Hijau */
  margin-top: 5px;
}
.total-price {
  text-align: right;
}
.total-price span {
  font-size: 15px;
  color: #666;
}
.total-price strong {
  display: block;
  font-size: 26px;
  font-weight: 700;
  color: var(--bay-of-many, #133e87);
}

/* 3. Bagian Metode Pembayaran */
.payment-method-section {
  padding: 25px;
  border-bottom: 1px solid #e0e0e0;
}
.payment-method-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.method-box {
  display: flex;
  align-items: center;
  gap: 15px;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #eee;
}
.bank-logo {
  height: 25px;
  object-fit: contain;
}
.va-details {
  flex: 1;
}
.va-details span {
  display: block;
  font-size: 14px;
  color: #666;
}
.va-details strong {
  font-size: 20px;
  font-weight: 700;
  color: #000;
}
.copy-button {
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.copy-button:hover {
  background: #e0e0e0;
}
.copy-icon {
  width: 20px;
  height: 20px;
  color: #555;
}

/* 4. Bagian Rincian Pesanan */
.order-details-section {
  padding: 25px;
}
.order-details-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}
.info-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  font-size: 15px;
}
.info-item:last-child {
  border-bottom: none;
}
.info-label {
  color: #666;
  flex: 1;
}
.info-detail {
  color: #000;
  font-weight: 600;
  text-align: right;
  flex: 1.5;
}
.info-item.items-rented .info-detail {
  text-align: left;
}
.item-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 5px;
}
.item-tag {
  background-color: #e0eaf6;
  color: var(--bay-of-many, #133e87);
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 13px;
  font-weight: 500;
}
</style>