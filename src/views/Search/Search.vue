<script setup>
defineOptions({ name: 'SearchPage' })
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { placesData } from '@/data/placesData'
import './Search.style.css'

const route = useRoute()
const router = useRouter()

// --- LOGIKA UNTUK SEARCH BAR ---
const searchKeyword = ref(route.query.location || '')
const searchDate = ref('')
const searchPeople = ref('')

const handleLocalSearch = () => {
    const keyword = searchKeyword.value.trim()
    
    router.push({ 
        query: { 
            location: keyword || 'Semua Lokasi'
        } 
    })
}

watch(() => route.query.location, (newKeyword) => {
    searchKeyword.value = newKeyword || ''
})

// --- LOGIKA HASIL PENCARIAN ---
const currentKeywordDisplay = computed(() => {
    return route.query.location || 'Semua Lokasi'
})

// Gunakan data dari file terpisah
const allResults = ref(placesData)

// Computed property yang memfilter hasil pencarian
const searchResults = computed(() => {
    const keyword = (route.query.location || '').toLowerCase()
    
    if (!keyword || keyword === 'semua lokasi') {
        return allResults.value
    }
    
    return allResults.value.filter(item => 
        item.title.toLowerCase().includes(keyword) || 
        item.location.toLowerCase().includes(keyword)
    )
})

// ✅ Redirect ke halaman detail
function handleBooking(itemId) {
    router.push({ 
        name: 'DetailTempatPemancing', 
        params: { id: itemId } 
    })
}
</script>

<template>
    <main class="search-page-wrapper">
        
        <!-- Search Bar Section -->
        <section class="search-section">
            <div class="search-container-custom">
                
                <div class="search-field-custom">
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <input 
                        type="text" 
                        class="search-input-custom" 
                        placeholder="Mau mancing dimana?" 
                        v-model="searchKeyword"
                        @keyup.enter="handleLocalSearch"
                    />
                </div>
                
                <div class="search-field-custom">
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
                
                <div class="search-field-custom">
                    <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <input 
                        type="number" 
                        class="search-input-custom" 
                        placeholder="Jumlah Orang" 
                        min="1" 
                        v-model="searchPeople"
                    />
                </div>
                
                <button class="search-button-custom" @click="handleLocalSearch">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </button>
            </div>
        </section>
        
        <h2 class="search-results-title">
            Tempat Pemancingan di Sekitar <b>{{ currentKeywordDisplay }}</b>
        </h2>

        <section class="results-container">
            <div v-if="searchResults.length > 0">
                <div class="result-card" v-for="item in searchResults" :key="item.id">
                    
                    <div class="card-image-section">
                        <img 
                            :src="item.image" 
                            :alt="item.title" 
                            loading="lazy" 
                            onerror="this.src='https://placehold.co/600x400/CCCCCC/FFFFFF?text=Error'"
                        >
                    </div>

                    <div class="card-content-section">
                        <h3 class="card-title">{{ item.title }} </h3>
                        
                        <div class="card-rating">
                            <div class="rating-box">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#FFC107" stroke="#FFC107" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                                <span class="rating-value">{{ item.rating }}</span>
                                <span class="review-count">({{ item.reviewCount }})</span>
                            </div>
                        </div>
                        
                        
                        <div class="card-location">
                            <svg class="location-icon-card" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span>{{ item.location }}</span>
                        </div>
                        
                        <p class="card-description">{{ item.description }}</p>
                        
                        <div class="card-price">{{ item.price }}</div>
                        
                        <div class="card-button-container">
                          <div class="card-facilities">
                            <span v-for="(facility, index) in item.facilities" :key="index" class="facility-tag">
                                {{ facility }}
                            </span>
                          </div>
                        
                          <div class="card-button-wrapper">
                            <button class="button-booking" @click="handleBooking(item.id)">
                                Detail
                            </button>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div v-else class="no-results-message">
                <h2>Ops, tidak ada hasil untuk "{{ currentKeywordDisplay }}"</h2>
                <p>Coba cari dengan kata kunci lain atau periksa kembali ejaan Anda.</p>
            </div>
        </section>

    </main>
</template>