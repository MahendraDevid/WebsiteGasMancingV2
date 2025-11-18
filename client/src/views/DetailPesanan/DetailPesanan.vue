<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import PaymentBox from '@/components/PaymentBox.vue'
import './DetailPesanan.style.css'

import { allOrders } from '@/data/ordersData.js'

const route = useRoute()

const order = ref(null)

onMounted(() => {
  const idFromUrl = parseInt(route.params.orderId)

  // Cari pesanan di dalam 'allOrders' yang ID-nya cocok
  const foundOrder = allOrders.find((o) => o.id === idFromUrl)

  if (foundOrder) {
    order.value = foundOrder
  } else {
    // Jika tidak ditemukan, bisa redirect atau tampilkan pesan error
    console.error(`Pesanan dengan ID ${idFromUrl} tidak ditemukan!`)
  }
})

function handleCopy() {
  if (!order.value) return // Pastikan 'order' sudah ada

  const tempInput = document.createElement('input')
  tempInput.value = order.value.kodeBayar // Ambil kodeBayar dinamis
  document.body.appendChild(tempInput)
  tempInput.select()
  document.execCommand('copy')
  document.body.removeChild(tempInput)

  // Beri tahu pengguna (lebih baik daripada alert)
  console.log('Kode bayar berhasil disalin!')
}

function handleConfirmation() {
  console.log('Proses pembayaran dikonfirmasi!')
  // Di sini Anda bisa navigasi ke halaman "Pesanan Saya"
  // router.push('/pesanan')
}
</script>

<template>
    <Navbar />

  <div v-if="order" class="confirmation-page-wrapper">
       
    <main class="confirmation-content-box">
           
      <h1 class="page-title">Detail Pesanan</h1>
      <PaymentBox title="" :totalPrice="order.totalPrice" :orderNumber="order.nomorPesanan" />      
           
      <section class="confirmation-details-wrapper">
               
        <h2 class="section-subtitle">Detail Pesanan</h2>
                       
        <div class="payment-code-section">
            <span class="code-label">Kode Bayar :</span>          
            <span class="code-value">{{ order.kodeBayar }}</span>          
            <button @click="handleCopy" class="copy-button" title="Salin Kode">
                       
            <svg
              class="copy-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
 >
                             
              <path
                d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"
              />
                         
            </svg>
                     
          </button>
                 
        </div>

        <!-- Tambahan: Metode Pembayaran -->
        <div class="payment-method-section">
            <span class="code-label">Metode Pembayaran :</span>
            <span class="code-value">{{ order.paymentMethod }}</span>
        </div>

        <div class="rental-info-container"> 
          <div class="location-date-person">
            <div class="info-item">
              <div class="icon-wrapper">
                <img src="/img/iconlokasi.png" class="detail-img" alt="Lokasi"/>                  
              </div>
                <span class="info-label">Lokasi</span>                    
                <span class="info-detail">{{ order.location }}</span>                
            </div>
                                           
            <div class="info-item">         
              <div class="icon-wrapper">               
                <img src="/img/calendar.png" class="detail-img" alt="Tanggal" />                    
              </div>
                <span class="info-label">Tanggal</span>                    
                <span class="info-detail">{{ order.orderDate }}</span>                
            </div>
                                           
            <div class="info-item">             
              <div class="icon-wrapper">                   
                <img src="/img/people.png" class="detail-img-large" alt="Orang" />                  
              </div>
                <span class="info-label">Orang</span>                    
                <span class="info-detail">{{ order.numPeople }}</span>                
            </div>
                       
          </div>

                     
          <!-- Peralatan yang Disewa -->
                     
          <div class="rented-items-box">              
            <h3 class="items-title">Peralatan yang Disewa :</h3>            
            <div v-if="order.rentedEquipment.length > 0 && order.rentedEquipment[0] !== 'Tidak ada'" class="item-list">
                <span v-for="(item, index) in order.rentedEquipment" :key="index" class="item-tag">
                    {{ item }}                    
                </span>        
            </div>             
            <p v-else class="no-equipment-text"><em>Tidak ada peralatan yang dipilih</em></p>           
          </div>    
        </div> 
      </section>
    </main>
  </div>    
</template>
