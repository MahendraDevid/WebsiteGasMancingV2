<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router'; // Digunakan untuk membaca query parameter
import './Search.style.css'; 

// Inisialisasi Route
const route = useRoute();

// State yang dihitung (computed) untuk mendapatkan keyword dari URL
const currentKeyword = computed(() => {
    // Membaca nilai dari URL query 'location'. Default ke 'Semua Lokasi' jika kosong.
    return route.query.location || 'Semua Lokasi';
});

// Data dummy lengkap untuk semua hasil
const allResults = ref([
    {
        id: 1,
        // 🌟 PERUBAHAN: Menggunakan gambar placeholder
        image: '/img/produk1.png', 
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
        // 🌟 PERUBAHAN: Menggunakan gambar placeholder
        image: '/img/produk1.png', 
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
        // 🌟 PERUBAHAN: Menggunakan gambar placeholder
        image: '/img/produk1.png', 
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
        // 🌟 PERUBAHAN: Menggunakan gambar placeholder
        image: '/img/produk1.png', 
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
    const keyword = currentKeyword.value.toLowerCase();
    
    if (!keyword || keyword === 'semua lokasi') {
        return allResults.value; // Tampilkan semua jika tidak ada keyword
    }
    
    return allResults.value.filter(item => 
        // Filter berdasarkan Judul atau Lokasi
        item.title.toLowerCase().includes(keyword) || 
        item.location.toLowerCase().includes(keyword)
    );
});


// Aksi ketika tombol booking diklik
function handleBooking(itemId) {
    console.log(`Booking untuk item ID: ${itemId}`);
    alert(`Booking untuk ${searchResults.value.find(item => item.id === itemId).title} berhasil!`);
}
</script>

<template>
    <main class="search-page-wrapper">
        <section class="search-bar-section">
            <div class="search-bar-container">
                <div class="search-bar-background"></div>
                
                <div class="search-field location">
                    <img class="icon" src="/img/loc.png" alt="Lokasi Icon">
                    <input type="text" :placeholder="currentKeyword">
                </div>
                
                <div class="search-field date">
                    <img class="icon" src="/img/calendar.png" alt="Tanggal Icon">
                    <input type="text" placeholder="Tanggal Mancing">
                </div>
                
                <div class="search-field people">
                    <img class="icon" src="/img/people.png" alt="Orang Icon">
                    <input type="text" placeholder="Jumlah Orang">
                </div>
                
                <button class="search-button">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="28" height="28">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>
        </section>

        <h2 class="search-results-title">
            Tempat Pemancingan di Sekitar **{{ currentKeyword }}**
        </h2>

        <section class="results-container">
            <div v-if="searchResults.length > 0">
                <div class="result-card" v-for="item in searchResults" :key="item.id">
                    
                    <div class="card-image-section">
                        <img :src="item.image" :alt="item.title" loading="lazy">
                    </div>

                    <div class="card-content-section">
                        
                        <h3 class="card-title">{{ item.title }}</h3>
                        
                        <div class="card-rating">
                            <div class="rating-box">
                                <img src="/img/star.png" alt="Star">
                                <span class="rating-value">
                                    {{ item.rating }}
                                </span>
                                <span class="review-count">
                                    ({{ item.reviewCount }})
                                </span>
                            </div>
                        </div>
                        
                        <div class="card-price">
                            {{ item.price }}
                        </div>
                        
                        <div class="card-location">
                            <img src="/img/loc.png" alt="Location Icon"> 
                            <span>{{ item.location }}</span>
                        </div>

                        <p class="card-description">
                            {{ item.description }}
                        </p>
                        
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
            <div v-else class="no-results-message">
                <h2>Ops, tidak ada hasil untuk "{{ currentKeyword }}"</h2>
                <p>Coba cari dengan kata kunci lain atau periksa kembali ejaan Anda.</p>
            </div>
        </section>
    </main>
</template>

<style scoped>
@import './Search.style.css';
/* Menambahkan style untuk pesan 'No Results' */
.no-results-message {
    text-align: center;
    padding: 100px 20px;
    color: var(--licorice);
}
.no-results-message h2 {
    font-size: 32px;
    margin-bottom: 10px;
}
.no-results-message p {
    font-size: 20px;
    color: var(--dove-gray);
}
</style>