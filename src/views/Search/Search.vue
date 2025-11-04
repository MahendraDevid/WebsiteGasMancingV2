<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// Import CSS eksternal di sini
import './Search.style.css'; 

const route = useRoute();
const router = useRouter();

// --- LOGIKA UNTUK SEARCH BAR ---
const searchKeyword = ref(route.query.location || '');
const searchDate = ref('');
const searchPeople = ref('');

// --- LOGIKA NOTIFIKASI KUSTOM (Mengganti alert()) ---
const notificationMessage = ref('');
const showNotification = ref(false);

const handleLocalSearch = () => {
    const keyword = searchKeyword.value.trim();
    
    // Update URL query
    router.push({ 
        query: { 
            location: keyword || 'Semua Lokasi'
            // Anda bisa tambahkan date dan people di sini jika perlu
        } 
    });
}

const closeNotification = () => {
    showNotification.value = false;
};

// Mengawasi jika URL berubah
watch(() => route.query.location, (newKeyword) => {
    searchKeyword.value = newKeyword || '';
});


// --- LOGIKA HASIL PENCARIAN ---

// Computed property untuk menampilkan keyword di judul
const currentKeywordDisplay = computed(() => {
    return route.query.location || 'Semua Lokasi';
});

// Data dummy lengkap untuk semua hasil
const allResults = ref([
    {
        id: 1,
        // 🌟 PERUBAHAN: Path gambar dari public/img/
        image: '/img/ancol.png', 
        title: 'Pantai Ancol',
        location: 'Ancol, Jakarta Barat',
        description: 'Tempat pemancingan laut yang populer dengan fasilitas lengkap dan suasana nyaman. Cocok untuk memancing harian.',
        price: 'Rp. 50.000/hari',
        rating: '4.2',
        reviewCount: '300',
        facilities: ['Toilet', 'Kantin', 'Parkir', '+1 Lainnya']
    },
    {
        id: 2,
        // 🌟 PERUBAHAN: Path gambar dari public/img/
        image: '/img/kolam.png', 
        title: 'Kolam Pemancingan Cibiru',
        location: 'Cibiru, Bandung',
        description: 'Kolam pemancingan air tawar dengan fokus pada ikan mas dan nila. Tersedia sewa alat dan umpan.',
        price: 'Rp. 30.000/jam',
        rating: '4.5',
        reviewCount: '150',
        facilities: ['Toilet', 'Kantin', 'Parkir']
    },
    {
        id: 3,
        // 🌟 PERUBAHAN: Path gambar dari public/img/
        image: '/img/muara.png', 
        title: 'Pemancingan Muara Karang',
        location: 'Pluit, Jakarta Utara',
        description: 'Pemancingan air payau terkenal dengan hasil udang dan bandeng. Area yang luas dan strategis di Jakarta Utara.',
        price: 'Rp. 60.000/hari',
        rating: '4.7',
        reviewCount: '500',
        facilities: ['Kantin', 'Parkir', 'Mushola']
    },
    {
        id: 4,
        // 🌟 PERUBAHAN: Path gambar dari public/img/
        image: '/img/balong.png', 
        title: 'Balong Kuluwung',
        location: 'Jatinangor, Bandung Timur',
        description: 'Kolam pemancingan keluarga dengan pemandangan sawah. Cocok untuk bersantai sambil memancing ikan mas dan gurame.',
        price: 'Rp. 35.000/jam',
        rating: '4.1',
        reviewCount: '120',
        facilities: ['Toilet', 'Kantin']
    },
]);

// Computed property yang memfilter hasil pencarian
const searchResults = computed(() => {
    const keyword = (route.query.location || '').toLowerCase();
    
    if (!keyword || keyword === 'semua lokasi') {
        return allResults.value; // Tampilkan semua jika tidak ada keyword
    }
    
    return allResults.value.filter(item => 
        item.title.toLowerCase().includes(keyword) || 
        item.location.toLowerCase().includes(keyword)
    );
});

// Aksi ketika tombol booking diklik
function handleBooking(itemId) {
    const itemTitle = searchResults.value.find(item => item.id === itemId).title;
    notificationMessage.value = `Booking untuk ${itemTitle} berhasil ditambahkan ke keranjang!`;
    showNotification.value = true;

    // Auto-hide after 4 seconds
    setTimeout(() => {
        showNotification.value = false;
    }, 4000);
}
</script>

<template>
    <main class="search-page-wrapper">
        
        <!-- Search Bar Section (Diperbarui dengan SVG Icons) -->
        <section class="search-section">
            <div class="search-container-custom">
                
                <!-- Input Lokasi -->
                <div class="search-field-custom">
                    <!-- Location Icon -->
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <input 
                        type="text" 
                        class="search-input-custom" 
                        placeholder="Mau mancing dimana?" 
                        v-model="searchKeyword"
                        @keyup.enter="handleLocalSearch"
                    />
                </div>
                
                <!-- Input Tanggal -->
                <div class="search-field-custom">
                    <!-- Calendar Icon -->
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <input 
                        type="text" 
                        class="search-input-custom" 
                        placeholder="Tanggal Mancing" 
                        onfocus="(this.type='date')" 
                        onblur="(this.type='text')" 
                        v-model="searchDate"
                    />
                </div>
                
                <!-- Input Jumlah Orang -->
                <div class="search-field-custom">
                    <!-- Users Icon -->
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <input 
                        type="number" 
                        class="search-input-custom" 
                        placeholder="Jumlah Orang" 
                        min="1" 
                        v-model="searchPeople"
                    />
                </div>
                
                <!-- Tombol Search -->
                <button class="search-button-custom" @click="handleLocalSearch">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>
        </section>
        
        <!-- Judul Hasil Pencarian -->
        <h2 class="search-results-title">
            Tempat Pemancingan di Sekitar **{{ currentKeywordDisplay }}**
        </h2>

        <!-- Result Cards Section -->
        <section class="results-container">
            <div v-if="searchResults.length > 0">
                <div class="result-card" v-for="item in searchResults" :key="item.id">
                    
                    <div class="card-image-section">
                        <!-- Menggunakan path gambar dari data dummy -->
                        <img 
                            :src="item.image" 
                            :alt="item.title" 
                            loading="lazy" 
                            onerror="this.src='https://placehold.co/600x400/CCCCCC/FFFFFF?text=Error'"
                        >
                    </div>

                    <div class="card-content-section">
                        <h3 class="card-title">{{ item.title }}</h3>
                        
                        <div class="card-rating">
                            <div class="rating-box">
                                <!-- Star Icon -->
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                <span class="rating-value">{{ item.rating }}</span>
                                <span class="review-count">({{ item.reviewCount }})</span>
                            </div>
                        </div>
                        
                        <div class="card-price">{{ item.price }}</div>
                        
                        <div class="card-location">
                            <!-- Location Icon -->
                            <svg class="location-icon-card" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span>{{ item.location }}</span>
                        </div>

                        <p class="card-description">{{ item.description }}</p>
                        
                        <div class="card-facilities">
                            <span v-for="(facility, index) in item.facilities" :key="index" class="facility-tag">
                                {{ facility }}
                            </span>
                        </div>

                        <div class="card-button-wrapper">
                            <button class="button-booking" @click="handleBooking(item.id)">
                                Booking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Pesan "Tidak Ada Hasil" -->
            <div v-else class="no-results-message">
                <h2>Ops, tidak ada hasil untuk "{{ currentKeywordDisplay }}"</h2>
                <p>Coba cari dengan kata kunci lain atau periksa kembali ejaan Anda.</p>
            </div>
        </section>

        <!-- Custom Notification/Modal (Mengganti Alert) -->
        <transition name="slide-up">
            <div v-if="showNotification" class="custom-notification-overlay" @click="closeNotification">
                <div class="custom-notification" @click.stop>
                    <p>{{ notificationMessage }}</p>
                    <button @click="closeNotification" class="close-notification-button">OK</button>
                </div>
            </div>
        </transition>

    </main>
</template>

