<script setup>
import { ref, onMounted } from 'vue'
// 1. Impor useRouter untuk navigasi
import { useRouter } from 'vue-router'

// Inisialisasi Router
const router = useRouter()

// State untuk input lokasi pencarian
const searchKeyword = ref('') 

// Fungsi navigasi yang membawa data pencarian
const goToSearch = () => {
    const keyword = searchKeyword.value.trim()
    
    // Navigasi ke rute /search dan kirim data sebagai query parameter 'location'
    router.push({ 
        name: 'search', // Pastikan rute ini terdaftar di router/index.js
        query: { 
            location: keyword || 'Semua Lokasi' 
        }
    }) 
}

function goToDetail(id) {
  router.push({
    name: 'DetailTempatPemancing',
    params: { id } // Pastikan route detail kamu pakai :id di router/index.js
  })
}

// Data dan Logika Carousel (tetap)
const carouselContainer = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)

const scrollCarousel = (direction) => {
    if (!carouselContainer.value) return;
    
    const container = carouselContainer.value;
    const card = container.querySelector('.carousel-card.medium') || container.querySelector('.carousel-card.large');
    const cardWidth = card ? card.clientWidth : 320; 
    const gap = 20; 
    const scrollAmount = (cardWidth + gap) * direction;
    
    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });

    setTimeout(() => {
        checkArrowState();
    }, 500);
};

const applyCardSizes = () => {
    if (!carouselContainer.value) return;

    const container = carouselContainer.value;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.clientWidth;
    const cards = container.querySelectorAll('.carousel-card');

    cards.forEach((card) => {
        const cardCenter = card.offsetLeft + card.clientWidth / 2;
        const viewportCenter = scrollLeft + containerWidth / 2;
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < containerWidth * 0.1) {
            card.classList.remove('small', 'medium');
            card.classList.add('large');
        } else if (distance < containerWidth * 0.25) {
            card.classList.remove('small', 'large');
            card.classList.add('medium');
        } else {
            card.classList.remove('medium', 'large');
            card.classList.add('small');
        }
    });
};

const checkArrowState = () => {
    if (!carouselContainer.value) return;

    const container = carouselContainer.value;
    const currentScrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;

    isAtStart.value = currentScrollLeft <= 10;
    isAtEnd.value = (maxScrollLeft - currentScrollLeft) <= 10;
};

const updateCarouselState = () => {
    applyCardSizes();
    checkArrowState();
};

onMounted(() => {
    if (carouselContainer.value) {
        const container = carouselContainer.value;
        
        const cards = container.querySelectorAll('.carousel-card');
        const targetCard = cards.length > 2 ? cards[2] : cards[0]; 
        
        if (targetCard) {
            const cardCenter = targetCard.offsetLeft + (targetCard.clientWidth / 2);
            const containerCenter = container.clientWidth / 2;
            const initialScrollLeft = cardCenter - containerCenter;

            container.scrollTo({ left: initialScrollLeft, behavior: 'auto' });
        }
        
        applyCardSizes(); 
        
        setTimeout(() => {
            checkArrowState();
        }, 50);

        container.addEventListener('scroll', updateCarouselState);
    }
});
</script>

<template>
    <div class="homepage">
        <main>
            <section class="hero-section">
                <img src="/img/hero-image.jpg" alt="Hero Image" class="hero-image" />
                <div class="hero-content">
                    <h1 class="hero-title-text">Temukan Spot Pemancingan Terbaik di Indonesia</h1>
                </div>
                <div class="shadow-gradient"></div>
            </section>

            <section class="search-section">
                <div class="search-container-custom">
                    <div class="search-field-custom">
                        <img src="/img/loc.png" alt="Lokasi" class="search-icon">
                        <input type="text" v-model="searchKeyword" class="search-input-custom" placeholder="Mau mancing dimana?" />
                    </div>
                    <div class="search-field-custom">
                        <img src="/img/calendar.png" alt="Tanggal" class="search-icon">
                        <input type="text" class="search-input-custom" placeholder="Tanggal Mancing" onfocus="(this.type='date')" onblur="(this.type='text')" />
                    </div>
                    <div class="search-field-custom">
                        <img src="/img/fasilitas.png" alt="Fasilitas" class="search-icon">
                        <input type="text" class="search-input-custom" placeholder="Fasilitas"/>
                    </div>
                    <button class="search-button-custom" @click="goToSearch">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="28" height="28">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>
            </section>

            <section class="popular-section">
                <div class="section-title">
                    <h2 class="section-title-text">Tempat Pemancingan Populer</h2>
                </div>
                
                <div class="cards-grid">
                    <div class="card">
                        <img src="/img/kolam.png" alt="Spot Mancing 1" class="card-image" />
                        <div class="card-content">
                            <span class="card-price-overlay">Rp. 30.000/hari</span>
                            <h3 class="card-title">Kolam Pemancingan Cibiru</h3>
                            <div class="card-location">
                                <span>Cibiru, Bandung</span>
                            </div>
                            <div class="card-rating">
                                <img src="/img/star.png" alt="Rating" class="rating-star-icon">
                                <span class="rating-score">4.5</span>
                                <span class="rating-count">(150 Ulasan)</span>
                            </div>
                            <p class="card-description">
                                Kolam pemancingan air tawar dengan fokus pada ikan mas dan nila. Tersedia sewa alat dan umpan.
                            </p>
                            <div class="card-facilities">
                                <span class="facility">Toilet</span>
                                <span class="facility">Kantin</span>
                                <span class="facility">Parkir</span>
                                <span class="facility-more">+4</span>
                            </div>
                            <button class="card-button" @click="goToDetail(2)">Lihat Detail</button>
                        </div>
                    </div>
                    
                    <div class="card">
                        <img src="/img/balong.png" alt="Spot Mancing 2" class="card-image" />
                        <div class="card-content">
                            <span class="card-price-overlay">Rp. 35.000/hari</span>
                            <h3 class="card-title">Balong Kuluwung</h3>
                            <div class="card-location">
                                <span>Jatinangor, Bandung Timur</span>
                            </div>
                            <div class="card-rating">
                                <img src="/img/star.png" alt="Rating" class="rating-star-icon">
                                <span class="rating-score">4.1</span>
                                <span class="rating-count">(120 Ulasan)</span>
                            </div>
                            <p class="card-description">
                                Kolam pemancingan keluarga dengan pemandangan sawah. Cocok untuk bersantai sambil memancing ikan mas dan gurame.
                            </p>
                            <div class="card-facilities">
                                <span class="facility">Toilet</span>
                                <span class="facility">Parkir Luas</span>
                                <span class="facility">Warung</span>
                            </div>
                            <button class="card-button" @click="goToDetail(4)">Lihat Detail</button>
                        </div>
                    </div>

                    <div class="card">
                        <img src="/img/ancol.png" alt="Spot Mancing 3" class="card-image" />
                        <div class="card-content">
                            <span class="card-price-overlay">Rp. 50.000/hari</span>
                            <h3 class="card-title">Pantai Ancol</h3>
                            <div class="card-location">
                                <span>Ancol, Jakarta Utara</span>
                            </div>
                            <div class="card-rating">
                                <img src="/img/star.png" alt="Rating" class="rating-star-icon">
                                <span class="rating-score">4.2</span>
                                <span class="rating-count">(300 Ulasan)</span>
                            </div>
                            <p class="card-description">
                                Tempat pemancingan laut yang populer dengan fasilitas lengkap dan suasana nyaman. Cocok untuk memancing harian.
                            </p>
                            <div class="card-facilities">
                                <span class="facility">Toilet</span>
                                <span class="facility">Kantin</span>
                                <span class="facility">Parkir</span>
                                <span class="facility">Musholla</span>
                            </div>
                            <button class="card-button" @click="goToDetail(1)">Lihat Detail</button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="tips-section">
                <div class="section-title">
                    <h2 class="section-title-text">Tips - Tips Memancing</h2>
                </div>

                <div class="carousel-wrapper">
                    <button class="carousel-nav-btn prev" @click="scrollCarousel(-1)" :disabled="isAtStart">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>

                    <div class="carousel" ref="carouselContainer" @scroll="updateCarouselState">
                        <div class="carousel-card">
                            <div class="carousel-card-header">
                                <img src="/img/book.png" alt="Tips Icon" class="card-icon" />
                                <h3>Umpan Terbaik</h3>
                            </div>
                            <p>Teknik mancing adalah panduan lengkap yang membahas berbagai metode memancing...</p>
                             <a href="/ensiklopedia?id=30" class="read-more">Baca Selengkapnya &rarr;</a>
                        </div>
                        <div class="carousel-card">
                            <div class="carousel-card-header">
                                <img src="/img/book.png" alt="Tips Icon" class="card-icon" />
                                <h3>Teknik Mancing</h3>
                            </div>
                            <p>Teknik mancing adalah panduan lengkap yang membahas berbagai metode memancing...</p>
                             <a href="/ensiklopedia?id=20" class="read-more">Baca Selengkapnya &rarr;</a>
                        </div>
                        <div class="carousel-card">
                            <div class="carousel-card-header">
                                <img src="/img/book.png" alt="Tips Icon" class="card-icon" />
                                <h3>Umpan Terbaik</h3>
                            </div>
                            <p>Teknik mancing adalah panduan lengkap yang membahas berbagai metode memancing...</p>
                             <a href="/ensiklopedia?id=30" class="read-more">Baca Selengkapnya &rarr;</a>
                        </div>
                        <div class="carousel-card">
                            <div class="carousel-card-header">
                                <img src="/img/book.png" alt="Tips Icon" class="card-icon" />
                                <h3>Pancingan Terbaik</h3>
                            </div>
                            <p>Teknik mancing adalah panduan lengkap yang membahas berbagai metode memancing...</p>
                             <a href="/ensiklopedia?id=40" class="read-more">Baca Selengkapnya &rarr;</a>
                        </div>
                            <div class="carousel-card">
                            <div class="carousel-card-header">
                                <img src="/img/book.png" alt="Tips Icon" class="card-icon" />
                                <h3>Jenis Ikan</h3>
                            </div>
                            <p>Teknik mancing adalah panduan lengkap yang membahas berbagai metode memancing...</p>
                             <a href="/ensiklopedia?id=50" class="read-more">Baca Selengkapnya &rarr;</a>
                        </div>
                    </div>

                    <button class="carousel-nav-btn next" @click="scrollCarousel(1)" :disabled="isAtEnd">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </section>
        </main>

        </div>
</template>

<style scoped src="./HomeView.style.css"></style>
