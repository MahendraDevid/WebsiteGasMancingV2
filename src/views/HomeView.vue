<script setup>
import { ref, onMounted } from 'vue' // <-- FIX: onMounted ditambahkan
import Modal from '../components/Modal.vue'

const showModal = ref(false)

function openModal() {
  showModal.value = true
}

const isMenuOpen = ref(false)
const carouselContainer = ref(null)

// Logika untuk menggeser carousel
const scrollCarousel = (direction) => {
  if (carouselContainer.value) {
    const scrollAmount = carouselContainer.value.clientWidth / 3;
    carouselContainer.value.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }
};

// Logika untuk mengatur kelas ukuran kartu carousel berdasarkan posisi
const updateCardSizes = () => {
  if (!carouselContainer.value) return;

  const containerWidth = carouselContainer.value.clientWidth;
  const scrollLeft = carouselContainer.value.scrollLeft;
  const cards = carouselContainer.value.querySelectorAll('.carousel-card');

  cards.forEach((card, index) => {
    const cardCenter = card.offsetLeft + card.clientWidth / 2;
    const viewportCenter = scrollLeft + containerWidth / 2;
    const distance = Math.abs(cardCenter - viewportCenter);

    // Semakin dekat ke tengah, semakin besar
    // Anda bisa menyesuaikan threshold ini
    if (distance < containerWidth * 0.1) { // Kartu paling tengah
      card.classList.remove('small', 'medium');
      card.classList.add('large');
    } else if (distance < containerWidth * 0.25) { // Kartu di samping tengah
      card.classList.remove('small', 'large');
      card.classList.add('medium');
    } else { // Kartu di ujung
      card.classList.remove('medium', 'large');
      card.classList.add('small');
    }
  });
};

onMounted(() => {
  updateCardSizes(); // Set ukuran awal saat komponen dimuat
  if (carouselContainer.value) {
    carouselContainer.value.addEventListener('scroll', updateCardSizes);
  }
});
</script>

<template>
  <div class="homepage">
    <header class="navbar">
      <div class="navbar-container">

        <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav class="menu-desktop">
          <a href="#" class="menu-item active">Beranda</a>
          <a href="#" class="menu-item">Pesanan Saya</a>
          <a href="#" class="menu-item">Ensiklopedia</a>
        </nav>

        <div class="auth-buttons">
          <button class="btn-masuk" @click="openModal">Masuk</button>
          <button class="btn-daftar">Daftar</button>
        </div>

      </div>

      <Modal v-if="showModal" @close="showModal = false" />

    </header> <nav :class="['menu-mobile', { active: isMenuOpen }]">
      <button class="menu-close" @click="isMenuOpen = false">&times;</button>
      <a href="#" class="menu-item active">Beranda</a>
      <a href="#" class="menu-item">Pesanan Saya</a>
      <a href="#" class="menu-item">Ensiklopedia</a>
      <div class="menu-auth">
        <button class="btn-masuk">Masuk</button>
        <button class="btn-daftar">Daftar</button>
      </div>
    </nav>

    <main>
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title-text">Temukan Spot Pemancingan Terbaik di Indonesia</h1>
        </div>
        <div class="shadow-gradient"></div>
      </section>

      <section class="search-section">
        <div class="search-container-custom">
          <div class="search-field-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="search-icon">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <input type="text" class="search-input-custom" placeholder="Mau mancing dimana?" />
          </div>
          <div class="search-field-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="search-icon">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <input type="text" class="search-input-custom" placeholder="Tanggal Mancing" onfocus="(this.type='date')"
              onblur="(this.type='text')" />
          </div>
          <div class="search-field-custom">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="search-icon">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <input type="number" class="search-input-custom" placeholder="Jumlah Orang" min="1" />
          </div>
          <button class="search-button-custom">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" width="28" height="28">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
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
            <div class="card-content">
              <span class="card-price-overlay">Rp. 50.000/hari</span>
              <h3 class="card-title">Danau Pemancingan Asri</h3>
              <div class="card-location">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M8 1.75a3.25 3.25 0 0 0-3.25 3.25c0 3.106 3.25 7.75 3.25 7.75s3.25-4.644 3.25-7.75A3.25 3.25 0 0 0 8 1.75Zm0 4.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
                    clip-rule="evenodd" />
                </svg>
                <span>Bogor, Jawa Barat</span>
              </div>
              <div class="card-rating">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M8 1.75a.75.75 0 0 1 .692 1.012l-1.32 3.84a.75.75 0 0 0 .562.904l4.068.718a.75.75 0 0 1 .42 1.273l-3.08 2.69a.75.75 0 0 0-.246.69l.82 3.974a.75.75 0 0 1-1.11.822L8.26 14.99a.75.75 0 0 0-.52 0l-3.518 2.69a.75.75 0 0 1-1.11-.822l.82-3.974a.75.75 0 0 0-.246-.69l-3.08-2.69a.75.75 0 0 1 .42-1.273l4.068-.718a.75.75 0 0 0 .562-.904l-1.32-3.84A.75.75 0 0 1 8 1.75Z"
                    clip-rule="evenodd" />
                </svg>
                <span class="rating-score">4.8</span>
                <span class="rating-count">(120 Ulasan)</span>
              </div>
              <p class="card-description">
                Tempat pemancingan keluarga dengan suasana yang asri dan sejuk.
                Tersedia berbagai jenis ikan...
              </p>
              <div class="card-facilities">
                <span class="facility">Restoran</span>
                <span class="facility">Mushola</span>
                <span class="facility">Toilet</span>
                <span class="facility-more">+4</span>
              </div>
              <button class="card-button">Lihat Detail</button>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <span class="card-price-overlay">Rp. 50.000/hari</span>
              <h3 class="card-title">Pantai Karang Indah</h3>
              <div class="card-location">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M8 1.75a3.25 3.25 0 0 0-3.25 3.25c0 3.106 3.25 7.75 3.25 7.75s3.25-4.644 3.25-7.75A3.25 3.25 0 0 0 8 1.75Zm0 4.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
                    clip-rule="evenodd" />
                </svg>
                <span>Banten, Jawa Barat</span>
              </div>
              <div class="card-rating">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M8 1.75a.75.75 0 0 1 .692 1.012l-1.32 3.84a.75.75 0 0 0 .562.904l4.068.718a.75.75 0 0 1 .42 1.273l-3.08 2.69a.75.75 0 0 0-.246.69l.82 3.974a.75.75 0 0 1-1.11.822L8.26 14.99a.75.75 0 0 0-.52 0l-3.518 2.69a.75.75 0 0 1-1.11-.822l.82-3.974a.75.75 0 0 0-.246-.69l-3.08-2.69a.75.75 0 0 1 .42-1.273l4.068-.718a.75.75 0 0 0 .562-.904l-1.32-3.84A.75.75 0 0 1 8 1.75Z"
                    clip-rule="evenodd" />
                </svg>
                <span class="rating-score">4.5</span>
                <span class="rating-count">(98 Ulasan)</span>
              </div>
              <p class="card-description">
                Spot mancing pinggir pantai dengan pemandangan karang yang indah.
                Cocok untuk teknik...
              </p>
              <div class="card-facilities">
                <span class="facility">Warung</span>
                <span class="facility">Parkir Luas</span>
                <span class="facility">Toilet</span>
              </div>
              <button class="card-button">Lihat Detail</button>
            </div>
          </div>

          <div class="card">
            <div class="card-content">
              <span class="card-price-overlay">Rp. 50.000/hari</span>
              <h3 class="card-title">Sungai Citarum Hulu</h3>
              <div class="card-location">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M8 1.75a3.25 3.25 0 0 0-3.25 3.25c0 3.106 3.25 7.75 3.25 7.75s3.25-4.644 3.25-7.75A3.25 3.25 0 0 0 8 1.75Zm0 4.5a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5Z"
                    clip-rule="evenodd" />
                </svg>
                <span>Bandung, Jawa Barat</span>
              </div>
              <div class="card-rating">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M8 1.75a.75.75 0 0 1 .692 1.012l-1.32 3.84a.75.75 0 0 0 .562.904l4.068.718a.75.75 0 0 1 .42 1.273l-3.08 2.69a.75.75 0 0 0-.246.69l.82 3.974a.75.75 0 0 1-1.11.822L8.26 14.99a.75.75 0 0 0-.52 0l-3.518 2.69a.75.75 0 0 1-1.11-.822l.82-3.974a.75.75 0 0 0-.246-.69l-3.08-2.69a.75.75 0 0 1 .42-1.273l4.068-.718a.75.75 0 0 0 .562-.904l-1.32-3.84A.75.75 0 0 1 8 1.75Z"
                    clip-rule="evenodd" />
                </svg>
                <span class="rating-score">4.2</span>
                <span class="rating-count">(45 Ulasan)</span>
              </div>
              <p class="card-description">
                Rasakan sensasi mancing di alam liar di hulu sungai Citarum.
                Ikan-ikan predator...
              </p>
              <div class="card-facilities">
                <span class="facility">Alam Liar</span>
                <span class="facility">Camping Area</span>
              </div>
              <button class="card-button">Lihat Detail</button>
            </div>
          </div>

        </div>
      </section>

      <section class="tips-section">
        <div class="section-title">
          <h2 class="section-title-text">Tips - Tips Memancing</h2>
        </div>

        <div class="carousel-wrapper">
          <button class="carousel-nav-btn prev" @click="scrollCarousel(-1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div class="carousel" ref="carouselContainer">
            <div class="carousel-card small">
              <h3>Umpan Terbaik</h3>
              <p>Teknik mancing adalah panduan lengkap yang membahas berbagai metode memancing, mulai dari teknik dasar
                hingga strategi tingkat lanjut...</p>
              <a href="#" class="read-more">Baca Selengkapnya</a>
            </div>
            <div class="carousel-card medium">
              <h3>Teknik Mancing</h3>
              <p>Teknik mancing adalah panduan lengkap yang membahas berbagai metode memancing, mulai dari teknik dasar
                hingga strategi tingkat lanjut...</p>
              <a href="#" class="read-more">Baca Selengkapnya</a>
            </div>
            <div class="carousel-card large">
              <h3>Umpan Terbaik</h3>
              <p>Teknik mancing adalah panduan lengkap yang membahas berbagai metode memancing, mulai dari teknik dasar
                hingga strategi tingkat lanjut...</p>
              <a href="#" class="read-more">Baca Selengkapnya</a>
            </div>
            <div class="carousel-card medium">
              <h3>Pancingan Terbaik</h3>
              <p>Teknik mancing adalah panduan lengkap yang membahas berbagai metode memancing, mulai dari teknik dasar
                hingga strategi tingkat lanjut...</p>
              <a href="#" class="read-more">Baca Selengkapnya</a>
            </div>
            <div class="carousel-card small">
              <h3>Jenis Ikan</h3>
              <p>Teknik mancing adalah panduan lengkap yang membahas berbagai metode memancing, mulai dari teknik dasar
                hingga strategi tingkat lanjut...</p>
              <a href="#" class="read-more">Baca Selengkapnya</a>
            </div>
          </div>

          <button class="carousel-nav-btn next" @click="scrollCarousel(1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div class="carousel-dots-custom">
          <span class="dot-custom active"></span>
          <span class="dot-custom"></span>
          <span class="dot-custom"></span>
          <span class="dot-custom"></span>
        </div>
      </section>
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-logo">
          <div class="logo-icon">
          </div>
          <h2>GAS<br />MANCING</h2>
        </div>
        <div class="footer-section">
          <h3>Tentang Kami</h3>
          <a href="#">Tentang Gas Mancing</a>
          <a href="#">Kontak</a>
          <a href="#">Karir</a>
        </div>
        <div class="footer-section">
          <h3>Link Cepat</h3>
          <a href="#">Spot Mancing</a>
          <a href="#">Tips & Trik</a>
          <a href="#">Event</a>
        </div>
        <div class="footer-section">
          <h3>Media Sosial</h3>
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
          <a href="#">TikTok</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Style untuk menggantikan <div> logo dengan file <img> */
.logo-image-file {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

/* Style Hero Section baru */
.hero-title-text {
  font-size: 58px; /* Lebih besar sesuai gambar */
  font-weight: 800; /* Lebih tebal */
  color: white;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  margin-bottom: 10px;
  line-height: 1.2;
  letter-spacing: -1px; /* Sedikit rapat */
}

/* Mengatur ulang posisi hero-content agar lebih ke tengah gambar */
.hero-content {
    top: 50%; /* Posisikan di tengah vertikal */
    transform: translate(-50%, -60%); /* Sesuaikan agar tepat di tengah */
    width: 90%;
    max-width: 900px; /* Maksimal lebar untuk teks */
    text-align: center;
    z-index: 2;
}

/* Style Section Title */
.section-title-text {
  font-size: 38px; /* Lebih besar sesuai gambar */
  font-weight: 700;
  color: var(--bay-of-many);
  text-transform: none; /* Jangan uppercase jika tidak diinginkan */
  margin-bottom: 40px;
}

/* Overlay Harga di Card Image */
.card {
  position: relative; /* Penting untuk positioning overlay */
}

.card-price-overlay {
  position: absolute;
  top: 15px;
  left: 15px;
  background-color: rgba(255, 255, 255, 0.9);
  color: var(--bay-of-many);
  padding: 8px 15px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  z-index: 5;
}


/* --- Custom Search Section Styles --- */
.search-container-custom {
  max-width: 1150px;
  margin: 0 auto;
  background-color: var(--white); /* Latar belakang putih */
  border-radius: 10px;
  padding: 10px; /* Padding lebih kecil */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15); /* Bayangan lebih halus */
  display: flex;
  gap: 10px; /* Jarak antar field */
  align-items: center;
  flex-wrap: nowrap; /* Agar tidak langsung wrap di desktop */
}

.search-field-custom {
  flex: 1; /* Agar mengambil ruang yang tersedia */
  min-width: 0; /* Penting untuk flex-item agar bisa menyusut */
  background-color: transparent; /* Tidak ada latar belakang di field itu sendiri */
  border-radius: 8px; /* Sudut lebih lembut */
  padding: 12px 15px; /* Padding di dalam field */
  display: flex;
  align-items: center;
  gap: 10px; /* Jarak antara ikon dan input */
  border: 1px solid var(--bon-jour); /* Border tipis */
  transition: border-color 0.3s ease;
}

.search-field-custom:focus-within {
  border-color: var(--btn-blue); /* Warna border saat fokus */
}

.search-icon {
  color: var(--dove-gray); /* Warna ikon */
  flex-shrink: 0; /* Agar ikon tidak menyusut */
  width: 22px; /* Ukuran ikon */
  height: 22px;
}

.search-input-custom {
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: var(--black);
  width: 100%; /* Mengisi sisa ruang */
  font-family: inherit;
}

.search-input-custom::placeholder {
  color: var(--sonic-silver);
  opacity: 1;
}

/* Input date agar teksnya terlihat normal */
.search-input-custom[type="date"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: transparent;
}
.search-input-custom[type="date"]::-webkit-datetime-edit {
    color: var(--sonic-silver);
}
.search-input-custom[type="date"]:not([value]) {
  color: var(--sonic-silver);
}
.search-input-custom[type="date"]::-webkit-datetime-edit-month-field,
.search-input-custom[type="date"]::-webkit-datetime-edit-day-field,
.search-input-custom[type="date"]::-webkit-datetime-edit-year-field {
  color: var(--black);
}

.search-button-custom {
  background-color: var(--btn-blue); /* Warna tombol biru */
  border: none;
  border-radius: 8px; /* Sudut lebih lembut */
  width: 50px; /* Ukuran tombol lebih kecil */
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--white); /* Warna ikon pencarian putih */
  transition: background-color 0.3s ease, transform 0.3s ease;
  flex-shrink: 0;
}

.search-button-custom:hover {
  background-color: #4f7aa8;
  transform: scale(1.05);
}

.search-button-custom svg {
  width: 24px; /* Ukuran ikon pencarian di tombol */
  height: 24px;
}

/* --- Carousel Tips Section Styles --- */
.carousel-wrapper {
  position: relative;
  max-width: 1200px; /* Atur max-width untuk wrapper */
  margin: 0 auto; /* Tengah */
  padding: 0 60px; /* Ruang untuk tombol panah */
}

.carousel {
  display: flex;
  gap: 20px; /* Jarak antar kartu */
  overflow-x: scroll; /* Mengizinkan pengguliran horizontal */
  scroll-snap-type: x mandatory; /* Mengunci scroll ke posisi kartu */
  padding: 40px 0; /* Padding vertikal untuk kartu */
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Sembunyikan scrollbar Firefox */
}

.carousel::-webkit-scrollbar {
  display: none; /* Sembunyikan scrollbar Webkit */
}

.carousel-card {
  flex-shrink: 0; /* Pastikan kartu tidak menyusut */
  width: 300px; /* Ukuran default */
  background-color: var(--cultured-pearl);
  border-radius: 20px;
  padding: 25px;
  box-shadow: 0 15px 15px rgba(0, 0, 0, 0.25);
  transition: all 0.5s ease;
  scroll-snap-align: center; /* Snap ke tengah kartu */
  display: flex;
  flex-direction: column;
  align-items: center; /* Pusatkan konten kartu */
  text-align: center; /* Pusatkan teks */
  min-height: 380px; /* Minimal tinggi agar konsisten */
  justify-content: center; /* Pusatkan secara vertikal */
}

/* Ukuran kartu carousel berdasarkan class */
.carousel-card.small {
  width: 280px;
  height: 330px;
  opacity: 0.6;
  transform: scale(0.85);
  box-shadow: 0 10px 10px rgba(0,0,0,0.15);
}

.carousel-card.medium {
  width: 320px;
  height: 380px;
  opacity: 0.8;
  transform: scale(0.95);
  box-shadow: 0 12px 12px rgba(0,0,0,0.2);
}

.carousel-card.large {
  width: 380px;
  height: 430px;
  opacity: 1;
  transform: scale(1);
  box-shadow: 0 15px 15px rgba(0,0,0,0.25);
}


.card-icon {
  width: 50px; /* Ukuran ikon lebih besar */
  height: 50px;
  margin-bottom: 25px; /* Jarak bawah ikon */
  object-fit: contain;
}

.carousel-card h3 {
  font-size: 26px; /* Ukuran judul lebih besar */
  font-weight: 600;
  color: var(--licorice);
  margin-bottom: 15px;
}

.carousel-card p {
  font-size: 15px;
  color: var(--gray);
  line-height: 1.6;
  margin-bottom: 25px;
  text-align: center; /* Pusatkan paragraf */
}

.read-more {
  color: var(--bay-of-many);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
}

.carousel-nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--bay-of-many);
  color: var(--white);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  box-shadow: 0 5px 10px rgba(0,0,0,0.2);
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.carousel-nav-btn:hover {
  background-color: #0f3166;
  transform: translateY(-50%) scale(1.1);
}

.carousel-nav-btn.prev {
  left: 0;
}

.carousel-nav-btn.next {
  right: 0;
}

.carousel-dots-custom {
  display: flex;
  justify-content: center;
  gap: 12px; /* Jarak antar dot */
  margin-top: 30px; /* Jarak dari carousel */
}

.dot-custom {
  width: 12px; /* Ukuran dot */
  height: 12px;
  border-radius: 50%;
  background-color: var(--alto);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot-custom.active {
  background-color: var(--bay-of-many); /* Warna dot aktif */
  transform: scale(1.2);
}


/* --- Responsive Adjustments --- */
@media (max-width: 1200px) {
  .hero-title-text {
    font-size: 50px;
  }
}

@media (max-width: 1024px) {
  /* Search Container Responsive */
  .search-container-custom {
    flex-wrap: wrap; /* Izinkan wrapping */
    padding: 15px;
  }
  .search-field-custom {
    flex: 1 1 calc(50% - 10px); /* 2 kolom di tablet */
    min-width: unset; /* Reset min-width */
  }
  .search-button-custom {
    width: 100%; /* Tombol search penuh */
    height: 50px;
  }

  /* Carousel */
  .carousel-wrapper {
    padding: 0 40px; /* Kurangi padding untuk tombol */
  }
  .carousel-nav-btn {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 768px) {
  .hero-title-text {
    font-size: 42px;
  }
  .hero-content {
    transform: translate(-50%, -50%); /* Sedikit penyesuaian lagi */
  }
  .section-title-text {
    font-size: 32px;
  }

  /* Search Container Responsive (Mobile) */
  .search-container-custom {
    flex-direction: column; /* Tumpuk ke bawah */
    gap: 8px;
    padding: 10px;
  }
  .search-field-custom {
    width: 100%; /* Ambil lebar penuh */
    flex: none; /* Nonaktifkan flex-grow */
  }
  .search-button-custom {
    height: 45px;
  }

  /* Carousel */
  .carousel-wrapper {
    padding: 0 20px; /* Padding lebih kecil */
  }
  .carousel-card.small,
  .carousel-card.medium,
  .carousel-card.large {
    width: 280px; /* Ukuran kartu lebih seragam di mobile */
    height: auto;
    min-height: 360px; /* Minimal tinggi */
    opacity: 1; /* Semua tampak penuh */
    transform: scale(1); /* Semua ukuran sama */
  }
  .carousel-nav-btn {
    display: none; /* Sembunyikan tombol panah di mobile, pakai scroll */
  }
}

@media (max-width: 480px) {
  .hero-title-text {
    font-size: 32px;
  }
  .section-title-text {
    font-size: 26px;
  }
  .card-price-overlay {
    font-size: 14px;
    padding: 6px 10px;
  }
  .carousel-card {
    min-height: 320px;
  }
  .carousel-card h3 {
    font-size: 22px;
  }
  .carousel-card p {
    font-size: 14px;
  }
}
</style>