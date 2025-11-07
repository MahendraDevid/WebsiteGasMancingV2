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

// State untuk peralatan, true jika dipilih
const equipment = ref({
  joran: false,
  umpan: false,
  saung: false,
  perahu: false,
});

// Daftar peralatan (untuk v-for)
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
    if (equipment.value[item.id]) {
      total += item.price;
    }
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

// Fungsi untuk memilih/membatalkan pilihan peralatan
function toggleEquipment(equipmentId) {
  equipment.value[equipmentId] = !equipment.value[equipmentId];
}

// ---   Daftar peralatan yang dipilih (array nama) ---
const selectedEquipment = computed(() => {
  return equipmentList.value
    .filter(item => equipment.value[item.id])
    .map(item => item.name);
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
            :class="['equipment-box', { active: equipment[item.id] }]"
            @click="toggleEquipment(item.id)"
          >
            <img 
              :src="item.icon" 
              :alt="item.name" 
              onerror="this.onerror=null; this.src='https://placehold.co/60x60/A2B9E4/FFFFFF?text=Icon'"
            >
            <span>{{ item.name }}</span>
            <span class="equipment-price">{{ formatCurrency(item.price) }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer Pembayaran -->
    <FooterPayment
        variant="checkout"
        :leftTitle="'Total'"
        :leftSubtitle="totalPriceFormatted"
        :buttonText="'Lanjut ke Pembayaran'"
          :nextRoute="`/payment?total=${encodeURIComponent(totalPriceFormatted)}&equipment=${encodeURIComponent(
          JSON.stringify(Object.keys(equipment).filter(key => equipment[key])))}`"
    />
  </main>
</template>
