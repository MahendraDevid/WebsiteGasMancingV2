<script setup>
defineProps({
  image: { type: String, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  facilities: { type: Array, required: true },
  
  // Props Opsional (Hanya untuk halaman Search)
  rating: { type: String, default: null },
  reviewCount: { type: String, default: null },
  price: { type: String, default: null },
  
  // Props Opsional (Hanya untuk halaman Pesanan)
  orderDate: { type: String, default: null },
  orderStatus: { type: String, default: null },
});
</script>

<template>
  <div class="location-card">
    <!-- Kiri: Gambar -->
    <div class="card-image-section">
      <img 
        :src="image" 
        :alt="title" 
        loading="lazy" 
        onerror="this.src='https://placehold.co/600x400/CCCCCC/FFFFFF?text=Error'"
      >
    </div>

    <!-- Kanan: Konten -->
    <div class="card-content-section">
      <h3 class="card-title">{{ title }}</h3>
      
      <!-- Slot untuk Rating (Hanya tampil jika prop rating ada) -->
      <div v-if="rating" class="card-rating">
        <div class="rating-box">
          <img src="/img/star.png" alt="Star">
          <span class="rating-value">{{ rating }}</span>
          <span class="review-count">({{ reviewCount }})</span>
        </div>
      </div>
      
      <!-- Slot untuk Harga (Hanya tampil jika prop price ada) -->
      <div v-if="price" class="card-price">{{ price }}</div>
      
      <div class="card-location">
        <img src="/img/loc.png" alt="Location Icon" class="location-icon-card"> 
        <span>{{ location }}</span>
      </div>

      <!-- Slot untuk Tanggal Pesanan (Hanya tampil jika prop orderDate ada) -->
      <div v-if="orderDate" class="card-order-date">
        <img src="/img/calendar.png" alt="Calendar Icon" class="location-icon-card">
        <span>Tanggal: {{ orderDate }}</span>
      </div>

      <p class="card-description">{{ description }}</p>
      
      <div class="card-facilities">
        <span v-for="(facility, index) in facilities" :key="index" class="facility-tag">
          {{ facility }}
        </span>
      </div>

      <!-- Slot untuk Tombol Aksi -->
      <div class="card-button-wrapper">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* SEMUA STYLE .result-card dari Search.style.css PINDAH KE SINI */
/* Nama diubah dari .result-card menjadi .location-card */
.location-card {
    background-color: var(--white);
    border-radius: 15px;
    box-shadow: 0px 13px 15px rgba(0, 0, 0, 0.25);
    display: flex;
    overflow: hidden;
    min-height: 350px;
}

.card-image-section {
    width: 45%; 
    min-width: 300px;
    overflow: hidden;
    flex-shrink: 0;
}

.card-image-section img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Tata letak CSS Grid yang fleksibel */
.card-content-section {
    padding: 30px 40px;
    flex-grow: 1;
    display: grid;
    /* Grid ini menangani SEMUA variasi (Search dan Pesanan) */
    grid-template-areas:
        "title      rate"      /* Rating akan kosong jika tidak ada prop */
        "location   rate"
        "date       ."         /* Tanggal akan kosong jika tidak ada prop */
        "description description"
        "facilities price"     /* Harga akan kosong jika tidak ada prop */
        "facilities actions";   /* 'actions' adalah slot tombol */
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto auto 1fr auto auto; 
    gap: 10px 15px;
}

.card-title {
    grid-area: title;
    font-size: 32px;
    font-weight: 600;
    color: var(--black);
    line-height: 1.2;
}

/* --- Bagian Opsional --- */
.card-price {
    grid-area: price;
    font-size: 28px;
    font-weight: 600;
    color: var(--licorice);
    align-self: end;
    justify-self: end;
}

.card-rating {
    grid-area: rate;
    justify-self: end;
    align-self: start;
}

.rating-box {
    background-color: var(--travertine);
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    gap: 5px;
    width: fit-content;
}

.rating-box img {
    width: 18px;
    height: 18px;
}

.rating-value {
    font-size: 20px;
    font-weight: 600;
    color: var(--licorice);
}

.review-count {
    font-size: 15px;
    color: var(--licorice);
}

.card-order-date {
    grid-area: date;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    font-weight: 500;
    color: var(--dove-gray); 
}
/* --- Akhir Bagian Opsional --- */


.card-location {
    grid-area: location;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 20px;
    color: var(--dove-gray); 
}
.card-location img, .card-order-date img, .location-icon-card {
    width: 25px;
    height: 25px;
    color: var(--dove-gray);
}

.card-description {
    grid-area: description;
    font-size: 17px;
    color: var(--licorice);
    text-align: justify;
    max-height: 100px;
    overflow: hidden;
    line-height: 1.6;
}

.card-facilities {
    grid-area: facilities;
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    align-self: end;
}

.facility-tag {
    background-color: var(--perano); 
    color: var(--bay-of-many); 
    font-size: 15px;
    padding: 5px 10px;
    border-radius: 5px;
    white-space: nowrap;
}

.card-facilities .facility-tag:last-child {
    background-color: var(--bon-jour); 
    color: var(--licorice);
}

.card-button-wrapper {
    grid-area: actions; /* Diubah dari 'button' ke 'actions' */
    justify-self: end;
    align-self: end;
    display: flex;
    flex-direction: column; /* Mengizinkan 2 tombol ditumpuk jika perlu */
    gap: 10px;
}

/* Style tombol di slot akan ditentukan oleh Halaman Induk (Pesanan.vue / Search.vue) */


/* --- RESPONSIVENESS (Berlaku untuk kedua halaman) --- */
@media (max-width: 1200px) {
    .card-image-section {
        min-width: 250px;
        width: 40%;
    }
}

@media (max-width: 992px) {
    .location-card {
        flex-direction: column; 
        min-height: auto;
    }

    .card-image-section {
        width: 100%; 
        height: 250px; 
        min-width: 0; 
    }
    
    .card-content-section {
        grid-template-areas:
            "title"
            "rate"
            "location"
            "date"
            "description"
            "price"
            "facilities"
            "actions";
        grid-template-columns: 1fr;
        grid-template-rows: auto auto auto auto 1fr auto auto auto;
        padding: 20px;
        gap: 15px 0; 
    }
    
    .card-price, .card-rating, .card-location, .card-facilities, .card-button-wrapper, .card-order-date {
        justify-self: start;
        align-self: start;
    }

    .card-button-wrapper {
        width: 100%;
    }
}

@media (max-width: 600px) {
    .card-title {
        font-size: 28px;
    }

    .card-price {
        font-size: 22px;
    }
    
    .card-rating {
        margin-top: 0;
    }

    .card-description {
        font-size: 16px;
    }
}
</style>