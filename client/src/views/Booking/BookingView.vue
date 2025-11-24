<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import api from '@/services/api'
import FooterPayment from '../../components/FooterPayment.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// --- KONFIGURASI URL GAMBAR (Backend) ---
const API_URL = 'http://localhost:3000/uploads/'

// Helper Gambar
const getImageUrl = (filename) => {
  if (!filename || filename === 'default_place.jpg') return '/img/kolam.png' // Default Place
  if (filename === '/img/placeholder-icon.png') return '/img/placeholder-icon.png' // Default Icon

  if (filename.startsWith('http') || filename.startsWith('/img')) return filename

  return `${API_URL}${filename}`
}

const spotInfo = ref(null)
const loading = ref(true)
const bookingDate = ref('')
const duration = ref(1)
const numPeople = ref(1)
const equipment = ref({})
const equipmentList = ref([])
const isSubmitting = ref(false)

// Modal Error State
const showErrorModal = ref(false)
const errorMessage = ref('')
const openErrorModal = (message) => { errorMessage.value = message; showErrorModal.value = true }
const closeErrorModal = () => { showErrorModal.value = false; errorMessage.value = '' }

const loadSpotData = async () => {
  loading.value = true;
  const placeId = route.params.id;

  if (!placeId) {
    console.error('ID tempat tidak ditemukan.');
    loading.value = false; return;
  }

  try {
    let data = null;
    const passedPlaceData = history.state.placeData;

    if (passedPlaceData && (passedPlaceData.id == placeId || passedPlaceData.id_tempat == placeId)) {
      data = passedPlaceData;
    } else {
      const response = await api.getPlaceById(placeId);
      if (response.data.success) data = response.data.data;
    }

    if (data) {
      spotInfo.value = {
        id: data.id || data.id_tempat,
        title: data.title,
        location: data.location,
        image: data.image_url, // Simpan nama file asli dari DB
        basePrice: data.basePrice || data.base_price,
      };

      await loadEquipmentList(spotInfo.value.id);
      initializeEquipmentState();
    } else {
      spotInfo.value = null;
    }
  } catch (error) {
    console.error('Error loading spot:', error);
    spotInfo.value = null;
  } finally {
    loading.value = false;
  }
};

const loadEquipmentList = async (placeId) => {
  try {
    const response = await api.getEquipmentListByPlace(placeId);
    if (response.data.success) {
      equipmentList.value = response.data.data.map(item => ({
        id_item: item.id_item,
        name: item.nama_item,
        price: parseFloat(item.price),
        icon: item.image_url || '/img/placeholder-icon.png', // Nama file atau default
      }));
    }
  } catch (error) {
    console.error('Error loading equipment:', error);
    equipmentList.value = [];
  }
};

const initializeEquipmentState = () => {
  const initialState = {}
  equipmentList.value.forEach((item) => {
    initialState[item.id_item] = 0
  })
  equipment.value = initialState
}

const handleCheckoutClick = async () => {
  if (!bookingDate.value) { openErrorModal('Mohon isi Tanggal pemesanan.'); return }
  if (!duration.value || duration.value < 1) { openErrorModal('Durasi minimal 1 jam.'); return }
  if (!numPeople.value || numPeople.value < 1) { openErrorModal('Jumlah orang minimal 1.'); return }

  const currentUser = authStore.currentUser;
  const loggedInUserId = currentUser ? currentUser.id_pengguna : null;

  if (!loggedInUserId) {
    openErrorModal('Anda harus **login** terlebih dahulu.');
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }

  const placeId = spotInfo.value.id
  const generateOrderNumber = () => 'B-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 900 + 100)

  const bookingPayload = {
    id_pengguna: loggedInUserId,
    id_tempat: placeId,
    nomor_pesanan: generateOrderNumber(),
    tgl_mulai_sewa: bookingDate.value,
    durasi_sewa_jam: duration.value,
    num_people: numPeople.value,
    total_biaya: totalPrice.value,
    detail_items: JSON.parse(selectedEquipmentParams.value),
  }

  try {
    isSubmitting.value = true
    const response = await api.createBooking(bookingPayload)

    if (response.data.success) {
      router.push({
        name: 'payment',
        query: {
          orderId: response.data.data.id_pesanan,
          total: totalPriceFormatted.value,
          equipment: selectedEquipmentParams.value
        },
      })
    } else {
      openErrorModal(`Gagal membuat pemesanan: ${response.data.message}`)
    }
  } catch (error) {
    console.error('Error submit booking:', error)
    openErrorModal('Terjadi kesalahan saat memproses pemesanan.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadSpotData()
})

const equipmentPrice = computed(() => {
  let total = 0
  if (!equipment.value) return 0
  for (const item of equipmentList.value) {
    const qty = equipment.value[item.id_item] || 0
    total += item.price * qty
  }
  return total
})

const totalPrice = computed(() => {
  if (!spotInfo.value) return 0
  const safeDuration = Math.max(1, duration.value || 1)
  const safeNumPeople = Math.max(1, numPeople.value || 1)
  const ticketTotal = spotInfo.value.basePrice * safeDuration * safeNumPeople
  return ticketTotal + equipmentPrice.value
})

const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'Rp 0'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value)
}

const totalPriceFormatted = computed(() => formatCurrency(totalPrice.value))

function increaseQty(id) { if (equipment.value[id] !== undefined) equipment.value[id]++ }
function decreaseQty(id) { if (equipment.value[id] > 0) equipment.value[id]-- }

const selectedEquipmentParams = computed(() => {
  if (!equipment.value) return JSON.stringify([])
  const selected = equipmentList.value
    .filter((item) => equipment.value[item.id_item] > 0)
    .map((item) => ({
      id_item: item.id_item,
      name: item.name,
      qty: equipment.value[item.id_item],
      price: item.price,
    }))
  return JSON.stringify(selected)
})
</script>

<template>
  <main class="booking-page-wrapper">
    
    <div v-if="showErrorModal" class="modal-overlay">
      <div class="modal-content">
        <div class="error-icon-circle">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="x-icon">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h2>Aksi Gagal!</h2>
        <p v-html="errorMessage"></p> 
        <button class="modal-close-btn" @click="closeErrorModal">Tutup</button>
      </div>
    </div>

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
          :src="getImageUrl(spotInfo.image)" 
          :alt="spotInfo.title"
          class="spot-info-image"
          @error="$event.target.src = '/img/kolam.png'"
        />

        <div class="spot-info-content">
          <h1>{{ spotInfo.title }}</h1>
          <p>
            <svg class="location-icon-card" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {{ spotInfo.location }}
          </p>
        </div>
      </section>

      <section class="booking-form-section">
        <h2>Detail Booking</h2>

        <div class="booking-inputs">
          <div class="input-group">
            <label for="tanggal">Tanggal</label>
            <input type="date" id="tanggal" v-model="bookingDate" required />
          </div>
          <div class="input-group">
            <label for="durasi">Durasi (jam)</label>
            <input type="number" id="durasi" v-model.number="duration" min="1" required />
          </div>
          <div class="input-group">
            <label for="jumlah">Jumlah Orang</label>
            <input type="number" id="jumlah" v-model.number="numPeople" min="1" required />
          </div>
        </div>

        <div class="equipment-section">
          <h2>Peralatan Tambahan</h2>
          <div class="equipment-grid">
            <div
              v-for="item in equipmentList"
              :key="item.id_item"
              :class="['equipment-box', { active: equipment[item.id_item] > 0 }]"
            >
              <img
                :src="getImageUrl(item.icon)" 
                :alt="item.name"
                @error="$event.target.src = '/img/placeholder-icon.png'"
              />
              
              <span class="equipment-name">{{ item.name }}</span>
              <span class="equipment-price">{{ formatCurrency(item.price) }}</span>

              <div class="qty-control">
                <button @click="decreaseQty(item.id_item)" :disabled="equipment[item.id_item] === 0" class="qty-btn">-</button>
                <span class="qty-display">{{ equipment[item.id_item] }}</span>
                <button @click="increaseQty(item.id_item)" class="qty-btn">+</button>
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
        @click="handleCheckoutClick"
      />
    </template>
  </main>
</template>

<style scoped src="./BookingView.style.css"></style>