<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api";

const route = useRoute();
const order = ref(null);
const loading = ref(true);
const error = ref(null);

// Format tanggal (dipakai pada detail sewa)
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

onMounted(async () => {
  try {
    const id = route.params.orderId;
    const res = await api.getPesananById(id);
    order.value = res.data.data;
  } catch (err) {
    error.value = "Gagal memuat detail pesanan.";
  } finally {
    loading.value = false;
  }
});

function handleCopy() {
  if (!order.value?.kode_bayar) return;
  navigator.clipboard.writeText(order.value.kode_bayar);
}
</script>

<template>
  <div class="confirmation-page-wrapper">

    <!-- LOADING -->
    <div v-if="loading">Memuat detail pesanan...</div>

    <!-- ERROR -->
    <div v-else-if="error" class="error-box">{{ error }}</div>

    <!-- CONTENT -->
    <div v-else class="confirmation-content-box">

      <!-- JUDUL -->
      <h1 class="page-title">Detail Pesanan</h1>

      <!-- =======================
          TOP SECTION (TOTAL + NOMOR PESANAN)
      ============================ -->
      <div class="payment-box-wrapper">
        <h2 class="section-subtitle">Informasi Pembayaran</h2>
        <div class="payment-box-header">
          <div class="total-harga-section">
            <span class="total-harga-label">Total Harga</span>
            <span class="total-harga-value">Rp {{ order.total_biaya.toLocaleString('id-ID') }}</span>
          </div>

          <div class="nomor-pesanan">
            #{{ order.nomor_pesanan }}
          </div>
        </div>
        <!-- KODE BAYAR -->
        <div class="payment-code-section">
          <span class="code-label">Kode Bayar:</span>
          <span class="code-value">{{ order.kode_bayar || "Tidak tersedia" }}</span>

          <button class="copy-button" @click="handleCopy">
            <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M16 1H4C2.9 1 2 1.9 2 3v14h2V3h12V1zm3 4H8C6.9 5 6 5.9 6 7v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
            </svg>
          </button>
        </div>

        <!-- METODE PEMBAYARAN -->
        <div class="payment-method-section">
          <span class="code-label">Metode Pembayaran:</span>
          <span class="code-value">{{ order.metode_pembayaran || "Tidak ada" }}</span>
        </div>
      </div>

      <!-- ==========================
            DETAIL PESANAN BOX UTAMA
      =========================== -->
      <section class="confirmation-details-wrapper">

        <h2 class="section-subtitle">Informasi Sewa</h2>

        <!-- ==========================
             INFO SEWA + ITEMS
        =========================== -->
        <div class="rental-info-container">

          <!-- INFO LOKASI, TANGGAL, ORANG -->
          <div class="location-date-person">

            <div class="info-item">
              <div class="icon-wrapper"><img src="/img/iconlokasi.png" class="detail-img" /></div>
              <span class="info-label">Lokasi</span>
              <span class="info-detail">{{ order.location }}</span>
            </div>

            <div class="info-item">
              <div class="icon-wrapper"><img src="/img/calendar.png" class="detail-img" /></div>
              <span class="info-label">Tanggal</span>
              <span class="info-detail">{{ formatDate(order.tgl_mulai_sewa) }}</span>
            </div>

            <div class="info-item">
              <div class="icon-wrapper"><img src="/img/people.png" class="detail-img-large" /></div>
              <span class="info-label">Orang</span>
              <span class="info-detail">{{ order.num_people }}</span>
            </div>

          </div>

          <!-- PERALATAN DISEWA -->
          <div class="rented-items-box">
            <h3 class="items-title">Peralatan yang Disewa :</h3>

            <div v-if="order.items?.length > 0" class="item-list">
              <span v-for="(item, i) in order.items" :key="i" class="item-tag">
                {{ item.name }} x{{ item.quantity }}
              </span>
            </div>

            <p v-else class="no-item">Tidak ada peralatan</p>
          </div>

        </div>
      </section>
    </div>
  </div>
</template>

<style scoped src="./DetailPesanan.style.css"></style>  
