<script setup>
import { ref } from 'vue'

// Terima keyword awal (dari URL) agar input di halaman Search terisi
const props = defineProps({
  initialKeyword: {
    type: String,
    default: ''
  }
})

// Definisikan event yang akan dikirim saat pencarian dilakukan
const emit = defineEmits(['search'])

// State lokal untuk input
const searchKeyword = ref(props.initialKeyword)
const searchDate = ref('')
const searchPeople = ref('')

// Fungsi yang mengirimkan data pencarian ke parent component (HomeView atau Search.vue)
const triggerSearch = () => {
  emit('search', {
    location: searchKeyword.value,
    date: searchDate.value,
    people: searchPeople.value
  })
}
</script>

<template>
  <section class="search-section">
    <div class="search-container-custom">

      <div class="search-field-custom">
        <img src="/img/loc.png" alt="Lokasi" class="search-icon">
        <input type="text" class="search-input-custom" placeholder="Mau mancing dimana?" v-model="searchKeyword"
          @keyup.enter="triggerSearch" />
      </div>

      <div class="search-field-custom">
        <img src="/img/calendar.png" alt="Tanggal" class="search-icon">
        <input type="text" class="search-input-custom" placeholder="Tanggal Mancing" onfocus="(this.type='date')"
          onblur="(this.type='text')" v-model="searchDate" />
      </div>

      <div class="search-field-custom">
        <img src="/img/fasilitas.png" alt="Fasilitas" class="search-icon">
        <input type="text" class="search-input-custom" placeholder="Fasilitas" v-model="searchPeople" />
      </div>

      <button class="search-button-custom" @click="triggerSearch">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          width="28" height="28">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </button>
    </div>
  </section>
</template>

<style scoped>
.search-section {
  position: relative;
  z-index: 10;
  margin-top: -80px;
  padding: 0 20px 60px;
}

.search-container-custom {
  max-width: 1150px;
  margin: 0 auto;
  background-color: var(--white);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: nowrap;
}

.search-field-custom {
  flex: 1;
  min-width: 0;
  background-color: transparent;
  border-radius: 8px;
  padding: 12px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--bon-jour);
  transition: border-color 0.3s ease;
}

.search-field-custom:focus-within {
  border-color: var(--btn-blue);
}

.search-icon {
  color: var(--dove-gray);
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  object-fit: contain;
}

.search-input-custom {
  border: none;
  background: transparent;
  outline: none;
  font-size: 16px;
  color: var(--black);
  width: 100%;
  font-family: inherit;
}

.search-input-custom::placeholder {
  color: var(--sonic-silver);
  opacity: 1;
}

.search-button-custom {
  background-color: var(--bay-of-many);
  border: none;
  border-radius: 8px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--white);
  transition: background-color 0.3s ease, transform 0.3s ease;
  flex-shrink: 0;
}

.search-button-custom:hover {
  background-color: #0f3166;
  transform: scale(1.05);
}

/* --- RESPONSIVE UNTUK SEARCH BAR --- */
@media (max-width: 1024px) {
  .search-container-custom {
    flex-wrap: wrap;
    padding: 15px;
  }

  .search-field-custom {
    flex: 1 1 calc(50% - 10px);
    min-width: unset;
  }

  .search-button-custom {
    width: 100%;
    height: 50px;
  }
}

@media (max-width: 768px) {
  .search-section {
    margin-top: -60px;
    padding: 0 15px 40px;
  }

  .search-container-custom {
    flex-direction: column;
    gap: 8px;
    padding: 10px;
  }

  .search-field-custom {
    width: 100%;
    flex: none;
  }

  .search-button-custom {
    height: 45px;
  }
}
</style>