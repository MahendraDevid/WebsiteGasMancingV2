<script setup>
import { ref, computed } from 'vue';
import './BookingView.style.css';
import FooterPayment from '../../components/FooterPayment.vue';

const spotInfo = ref({
  title: 'Pantai Ancol',
  location: 'Ancol, Jakarta Barat',
  image: '/img/ancol.png',
  basePrice: 50000,
});

// --- Form State ---
const bookingDate = ref('');
const duration = ref(1);
const numPeople = ref(1);

// --- State Peralatan (Quantity) ---
// Diubah dari boolean (true/false) menjadi number (0)
const equipment = ref({
  joran: 0,
  umpan: 0,
  saung: 0,
  perahu: 0,
});

// Daftar peralatan
const equipmentList = ref([
  { id: 'joran', name: 'Joran', icon: '/img/icon-joran.png', price: 15000 },
  { id: 'umpan', name: 'Umpan', icon: '/img/icon-umpan.png', price: 10000 },
  { id: 'saung', name: 'Saung', icon: '/img/icon-saung.png', price: 25000 },
  { id: 'perahu', name: 'Perahu', icon: '/img/icon-perahu.png', price: 50000 },
]);

// --- Logika Perhitungan Harga ---
const equipmentPrice = computed(() => {
  let total = 0;
  for (const item of equipmentList.value) {
    const qty = equipment.value[item.id] || 0;
    total += item.price * qty; // Harga * Jumlah
  }
  return total;
});

const totalPrice = computed(() => {
  const safeDuration = Math.max(1, duration.value || 1);
  const safeNumPeople = Math.max(1, numPeople.value || 1);
  const ticketTotal = (spotInfo.value.basePrice * safeDuration) * safeNumPeople;
  return ticketTotal + equipmentPrice.value;
});

// Format harga ke Rupiah
const formatCurrency = (value) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const totalPriceFormatted = computed(() => formatCurrency(totalPrice.value));

// --- Fungsi Mengubah Quantity ---
function increaseQty(id) {
  equipment.value[id]++;
}

function decreaseQty(id) {
  if (equipment.value[id] > 0) {
    equipment.value[id]--;
  }
}

// --- Menyiapkan Data untuk dikirim ke Payment ---
// Kita kirim array object berisi { name, quantity }
const selectedEquipmentParams = computed(() => {
  const selected = equipmentList.value
    .filter(item => equipment.value[item.id] > 0)
    .map(item => ({
      name: item.name,
      qty: equipment.value[item.id],
      price: item.price
    }));
  
  return JSON.stringify(selected);
});
</script>

<template>
  <main class="booking-page-wrapper">
    
    <section class="spot-info-card">
      <img 
        :src="spotInfo.image" 
        :alt="spotInfo.title" 
        class="spot-info-image"
        onerror="this.onerror=null; this.src='https://placehold.co/150x100/6B7280/FFFFFF?text=Image+Not+Found';"
      >
      <div class="spot-info-content">
        <h1>{{ spotInfo.title }}</h1>
        <p>
          <svg class="location-icon-card" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ spotInfo.location }}
        </p>
      </div>
    </section>

    <section class="booking-form-section">
      <h2>Detail Booking</h2>
      
      <div class="booking-inputs">
        <div class="input-group">
          <label for="tanggal">Tanggal</label>
          <input type="date" id="tanggal" v-model="bookingDate">
        </div>
        <div class="input-group">
          <label for="durasi">Durasi (jam)</label>
          <input type="number" id="durasi" v-model="duration" min="1">
        </div>
        <div class="input-group">
          <label for="jumlah">Jumlah Orang</label>
          <input type="number" id="jumlah" v-model="numPeople" min="1">
        </div>
      </div>

      <div class="equipment-section">
        <h2>Peralatan Tambahan</h2>
        <div class="equipment-grid">
          <div 
            v-for="item in equipmentList" 
            :key="item.id"
            :class="['equipment-box', { active: equipment[item.id] > 0 }]"
          >
            <img 
              :src="item.icon" 
              :alt="item.name" 
              onerror="this.onerror=null; this.src='https://placehold.co/60x60/A2B9E4/FFFFFF?text=Icon'"
            >
            <span class="equipment-name">{{ item.name }}</span>
            <span class="equipment-price">{{ formatCurrency(item.price) }}</span>
            
            <div class="qty-control">
              <button @click="decreaseQty(item.id)" :disabled="equipment[item.id] === 0" class="qty-btn">-</button>
              <span class="qty-display">{{ equipment[item.id] }}</span>
              <button @click="increaseQty(item.id)" class="qty-btn">+</button>
            </div>

          </div>
        </div>
      </div>
    </section>

    <FooterPayment
        variant="checkout"
        :leftTitle="'Total'"
        :leftSubtitle="totalPriceFormatted"
        :buttonText="'Lanjut ke Pembayaran'"
          :nextRoute="`/payment?total=${encodeURIComponent(totalPriceFormatted)}&equipment=${encodeURIComponent(selectedEquipmentParams)}`"
    />
  </main>
</template>