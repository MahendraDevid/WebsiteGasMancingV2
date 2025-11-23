<template>
  <main class="booking-page-wrapper">
    
    <!-- ======================================================= -->
    <!-- MODAL ERROR BARU (Untuk validasi field atau kegagalan API) -->
    <!-- ======================================================= -->
    <div v-if="showErrorModal" class="modal-overlay">
      <div class="modal-content">
        <div class="error-icon-circle">
          <!-- Ikon Silang (X) untuk Error -->
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="x-icon">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <h2>Aksi Gagal!</h2>
        <!-- Menampilkan pesan error dari state, menggunakan v-html untuk memproses tag bold (**) dari pesan -->
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
          :src="spotInfo.image"
          :alt="spotInfo.title"
          class="spot-info-image"
          onerror="this.onerror=null; this.src='https://placehold.co/150x100/6B7280/FFFFFF?text=Image+Not+Found';"
        />
        <div class="spot-info-content">
          <h1>{{ spotInfo.title }}</h1>
          <p>
            <svg
              class="location-icon-card"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
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
                :src="item.icon"
                :alt="item.name"
                onerror="this.onerror=null; this.src='https://placehold.co/60x60/A2B9E4/FFFFFF?text=Icon'"
              />
              <span class="equipment-name">{{ item.name }}</span>
              <span class="equipment-price">{{ formatCurrency(item.price) }}</span>

              <div class="qty-control">
                <button
                  @click="decreaseQty(item.id_item)"
                  :disabled="equipment[item.id_item] === 0"
                  class="qty-btn"
                >
                  -
                </button>
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

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import './BookingView.style.css'
import FooterPayment from '../../components/FooterPayment.vue'
import { useAuthStore } from '../../stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const spotInfo = ref(null)
const loading = ref(true)

const bookingDate = ref('')
const duration = ref(1)
const numPeople = ref(1)
const equipment = ref({})
// Asumsi ini adalah state dan fungsi untuk modal sukses/ulasan yang ada di prompt
const showSuccessModal = ref(false)
const closeModal = () => { showSuccessModal.value = false }


const isSubmitting = ref(false)

// Ubah menjadi ref kosong yang akan diisi dari API
const equipmentList = ref([]) // <-- Diisi dari API


// --- STATE BARU UNTUK MODAL ERROR ---
const showErrorModal = ref(false)
const errorMessage = ref('')

const openErrorModal = (message) => {
    errorMessage.value = message
    showErrorModal.value = true
}

const closeErrorModal = () => {
    showErrorModal.value = false
    errorMessage.value = ''
}
// ------------------------------------


const loadSpotData = async () => {
    loading.value = true;
    const placeId = route.params.id;

    if (!placeId) {
        console.error('ID tempat tidak ditemukan di rute.');
        loading.value = false;
        return;
    }

    try {
        let data = null;
        const passedPlaceData = history.state.placeData;

        // 1. Coba ambil dari History State
        if (passedPlaceData && (passedPlaceData.id == placeId || passedPlaceData.id_tempat == placeId)) {
            data = passedPlaceData;
        } else {
            // 2. Jika tidak ada, panggil API
            const response = await api.getPlaceById(placeId);
            if (response.data.success) {
                data = response.data.data;
            } else {
                console.error("API Gagal memuat data tempat.");
            }
        }

        // 3. Proses Data Tempat
        if (data) {
            spotInfo.value = {
                id: data.id || data.id_tempat,
                title: data.title,
                location: data.location,
                image: data.image_url,
                basePrice: data.basePrice || data.base_price,
            };

            // 4. Panggil Equipment (HANYA JIKA spotInfo SUDAH TERISI)
            await loadEquipmentList(spotInfo.value.id);
            initializeEquipmentState();
        } else {
            spotInfo.value = null; // Ini akan memicu tampilan 'Tempat tidak ditemukan'
        }
        
    } catch (error) {
        console.error('Error saat memuat data tempat:', error);
        spotInfo.value = null;
    } finally {
        loading.value = false;
    }
};

const loadEquipmentList = async (placeId) => {
    try {
        const response = await api.getEquipmentListByPlace(placeId); // API baru
        if (response.data.success) {
            // MAPPING: Pastikan key DB (id_item, nama_item, price) digunakan di frontend
            equipmentList.value = response.data.data.map(item => ({
                id_item: item.id_item, // ID PENTING!
                name: item.nama_item,
                price: parseFloat(item.price), 
                icon: item.image_url || '/img/placeholder-icon.png', // Gunakan image_url
            }));
        }
    } catch (error) {
        console.error('Error loading equipment list:', error);
        equipmentList.value = [];
    }
};

const initializeEquipmentState = () => {
  const initialState = {}
  // Loop melalui equipmentList yang SUDAH dimuat dari API
  equipmentList.value.forEach((item) => {
    // Kunci equipment harus menggunakan ID item dari database (id_item)
    // dan pastikan ID ini unik untuk setiap item!
    initialState[item.id_item] = 0 // <-- Menggunakan item.id_item sebagai key
  })
  equipment.value = initialState
}

const handleCheckoutClick = async () => {
  // --- 1. VALIDASI FIELD BOOKING ---
  if (!bookingDate.value) {
      openErrorModal('Mohon isi Tanggal pemesanan.')
      return
  }
  // Pastikan nilai adalah angka yang valid dan minimal 1
  if (!duration.value || typeof duration.value !== 'number' || duration.value < 1) {
      openErrorModal('Durasi sewa minimal 1 jam.')
      return
  }
  // Pastikan nilai adalah angka yang valid dan minimal 1
  if (!numPeople.value || typeof numPeople.value !== 'number' || numPeople.value < 1) {
      openErrorModal('Jumlah orang minimal 1 orang.')
      return
  }
  // ------------------------------------
  
  const currentUser = authStore.currentUser;
  const loggedInUserId = currentUser ? currentUser.id_pengguna : null;

  if(!loggedInUserId) {
    // Mengganti alert dengan modal error
    openErrorModal('Anda harus **login** terlebih dahulu untuk melanjutkan pemesanan.')
    router.push({ name: 'login', query: { redirect: route.fullPath } });
    return;
  }

  const placeId = spotInfo.value.id
  if (!placeId) {
    openErrorModal('Data Tempat tidak lengkap.')
    return
  }

  const generateOrderNumber = () => {
    return 'B-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 900 + 100)
  }

  // --- PAYLOAD FINAL YANG DIKIRIM KE BACKEND ---
  const bookingPayload = {
    // DATA UTAMA UNTUK TABEL PEMESANAN (pemesanan)
    id_pengguna: loggedInUserId, // <<< GANTI ID PENGGUNA ASLI
    id_tempat: placeId,
    nomor_pesanan: generateOrderNumber(),
    tgl_mulai_sewa: bookingDate.value,
    durasi_sewa_jam: duration.value,
    num_people: numPeople.value,
    total_biaya: totalPrice.value,

    // DATA DETAIL UNTUK TABEL ITEM (detail_pemesanan_item)
    // Kita kirim sebagai array of objects, diasumsikan backend akan mengolahnya
    detail_items: JSON.parse(selectedEquipmentParams.value),
  }

  console.log('Final Booking Payload:', bookingPayload)

  try {
    isSubmitting.value = true
    // 2. Panggil API
    const response = await api.createBooking(bookingPayload)

    if (response.data.success) {
      const orderId = response.data.data.id_pesanan

      console.log(`Pemesanan berhasil. Redirecting ke Payment untuk Order ID: ${orderId}`)

      // PERBAIKAN KUNCI DI SINI:
      router.push({
        name: 'payment', // Pastikan namanya lowercase: 'payment'
        query: { 
          orderId: orderId,
          total: totalPriceFormatted.value,
          equipment: selectedEquipmentParams.value
         },
      })
    } else {
      // Tampilkan modal error jika API gagal tapi memberikan pesan
      openErrorModal(`Gagal membuat pemesanan: ${response.data.message}`)
    }
  } catch (error) {
    console.error('Error saat submit booking:', error)
    // Tampilkan modal error untuk error jaringan/server
    openErrorModal('Terjadi kesalahan saat memproses pemesanan. Mohon coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  loadSpotData()
})

// LOGIKA HARGA, QTY, DAN FORMATTING
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
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

const totalPriceFormatted = computed(() => formatCurrency(totalPrice.value))


function increaseQty(id) {
  // Pastikan 'id' yang diterima (id_item) ada di objek equipment
  if (equipment.value[id] !== undefined) {
    equipment.value[id]++ // <-- Akan menambahkan kuantitas berdasarkan id_item
  }
}

function decreaseQty(id) {
  if (equipment.value[id] > 0) {
    equipment.value[id]-- // <-- Akan mengurangi kuantitas berdasarkan id_item
  }
}

const selectedEquipmentParams = computed(() => {
  if (!equipment.value) return JSON.stringify([])
  const selected = equipmentList.value
    .filter((item) => equipment.value[item.id_item] > 0)
    .map((item) => ({
      id_item: item.id_item,
      name: item.nama_item,
      qty: equipment.value[item.id_item],
      price: item.price,
    }))
  return JSON.stringify(selected)
})

const handlePaymentRoute = computed(() => {
  const placeId = spotInfo.value ? spotInfo.value.id : ''
  const date = bookingDate.value
  const durationValue = duration.value
  const numPeopleValue = numPeople.value

  const queryParams = new URLSearchParams({
    placeId: placeId,
    date: date,
    duration: durationValue,
    people: numPeopleValue,
    total: totalPrice.value,
    equipment: selectedEquipmentParams.value,
  })

  return `/payment?${queryParams.toString()}`
})
</script>

<style scoped src="./BookingView.style.css"></style>