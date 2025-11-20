<template>
  <main class="booking-page-wrapper">
    
    <div v-if="loading" class="loading-state">
      <p>Memuat data tempat pemancingan...</p>
    </div>

    <div v-else-if="!spotInfo" class="error-container-404">
      <div class="error-content-404">
        <h2 class="error-title-404">Tempat tidak ditemukan</h2>
        <p class="error-message-404">Maaf, data tempat pemancingan tidak tersedia.</p>
        <button @click="router.push('/search')" class="error-button-404">
          Kembali ke Pencarian
        </button>
      </div>
    </div>
    <template v-else>
      <section class="spot-info-card">
        <img 
          :src="spotInfo.image" 
          :alt="spotInfo.title" 
          class="spot-info-image"
          onerror="this.onerror=null; this.src='https://placehold.co/150x100/6B7280/FFFFFF?text=Image+Not+Found';"
        >
        <div class="spot-info-content">
          <h1>{{ spotInfo.title }} (ID: {{ spotInfo.id }})</h1>
          <p class="base-price">Harga Dasar: {{ formatCurrency(spotInfo.basePrice) }} / jam / orang</p>
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
            <input type="date" id="tanggal" v-model="bookingDate" required>
          </div>
          <div class="input-group">
            <label for="durasi">Durasi (jam)</label>
            <input type="number" id="durasi" v-model.number="duration" min="1" required>
          </div>
          <div class="input-group">
            <label for="jumlah">Jumlah Orang</label>
            <input type="number" id="jumlah" v-model.number="numPeople" min="1" required>
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
          :nextRoute="handlePaymentRoute"
      />
    </template>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/services/api'; 
import './BookingView.style.css';
import FooterPayment from '../../components/FooterPayment.vue';

const route = useRoute();
const router = useRouter();

const spotInfo = ref(null); 
const loading = ref(true);

const bookingDate = ref('');
const duration = ref(1);
const numPeople = ref(1);
const equipment = ref({}); 

const equipmentList = ref([
  { id: 'joran', name: 'Joran', icon: '/img/icon-joran.png', price: 15000 },
  { id: 'umpan', name: 'Umpan', icon: '/img/icon-umpan.png', price: 10000 },
  { id: 'saung', name: 'Saung', icon: '/img/icon-saung.png', price: 25000 },
  { id: 'perahu', name: 'Perahu', icon: '/img/icon-perahu.png', price: 50000 },
]);

const loadSpotData = async () => {
  loading.value = true;
  const placeId = route.params.id; 

  if (!placeId) {
    console.error("ID tempat tidak ditemukan di rute.");
    loading.value = false;
    return;
  }

  const passedPlaceData = history.state.placeData;

  if (passedPlaceData && (passedPlaceData.id == placeId || passedPlaceData.id_tempat == placeId)) {
    spotInfo.value = {
        id: passedPlaceData.id || passedPlaceData.id_tempat,
        title: passedPlaceData.title,
        location: passedPlaceData.location,
        image: passedPlaceData.image_url, 
        basePrice: passedPlaceData.base_price,
    };
    initializeEquipmentState();
    loading.value = false;
    return; 
  }

  try {
    const response = await api.getPlaceById(placeId);
    
    if (response.data.success) {
      const data = response.data.data;
      spotInfo.value = {
        id: data.id || data.id_tempat, // Ambil ID yang ada
        title: data.title,
        location: data.location,
        image: data.image_url, 
        basePrice: data.basePrice || data.base_price, 
      };
      initializeEquipmentState();
    } else {
      spotInfo.value = null;
    }
  } catch (error) {
    console.error('Error loading place:', error);
    spotInfo.value = null;
  } finally {
    loading.value = false;
  }
};

const initializeEquipmentState = () => {
  const initialState = {};
  equipmentList.value.forEach(item => {
    initialState[item.id] = 0;
  });
  equipment.value = initialState;
};

onMounted(() => {
  loadSpotData();
});

// LOGIKA HARGA, QTY, DAN FORMATTING (SAMA SEPERTI SEBELUMNYA)
const equipmentPrice = computed(() => {
  let total = 0;
  if (!equipment.value) return 0;
  for (const item of equipmentList.value) {
    const qty = equipment.value[item.id] || 0;
    total += item.price * qty;
  }
  return total;
});

const totalPrice = computed(() => {
  if (!spotInfo.value) return 0;
  const safeDuration = Math.max(1, duration.value || 1);
  const safeNumPeople = Math.max(1, numPeople.value || 1);
  const ticketTotal = (spotInfo.value.basePrice * safeDuration) * safeNumPeople;
  return ticketTotal + equipmentPrice.value;
});

const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value);
};

const totalPriceFormatted = computed(() => formatCurrency(totalPrice.value));

function increaseQty(id) {
  if (equipment.value[id] !== undefined) {
    equipment.value[id]++;
  }
}

function decreaseQty(id) {
  if (equipment.value[id] > 0) {
    equipment.value[id]--;
  }
}

const selectedEquipmentParams = computed(() => {
  if (!equipment.value) return JSON.stringify([]);
  const selected = equipmentList.value
    .filter(item => equipment.value[item.id] > 0)
    .map(item => ({
      name: item.name,
      qty: equipment.value[item.id],
      price: item.price
    }));
  return JSON.stringify(selected);
});

const handlePaymentRoute = computed(() => {
  const placeId = spotInfo.value ? spotInfo.value.id : '';
  const date = bookingDate.value;
  const durationValue = duration.value;
  const numPeopleValue = numPeople.value;

  const queryParams = new URLSearchParams({
    placeId: placeId,
    date: date,
    duration: durationValue,
    people: numPeopleValue,
    total: totalPrice.value, 
    equipment: selectedEquipmentParams.value 
  });

  return `/payment?${queryParams.toString()}`;
});
</script>

<style scoped src="./BookingView.style.css"></style>