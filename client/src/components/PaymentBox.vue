<template>
  <header class="payment-header">
    <h1 class="payment-title">{{ title }}</h1>
  </header>
  <section class="order-summary">
    <div class="order-total">
      <span>Total Harga</span>
      <strong>{{ totalPrice }}</strong>
    </div>
    
    <div class="order-number">
      <span>#Nomor Pesanan</span>
      <strong>{{ nomorPesanan }}</strong>
    </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    required: true,
    default: 'Pembayaran'
  },
  totalPrice: {
    type: String,
    required: true,
    default: 'Rp. 0,-'
  },
  // Pastikan nama props ini sama persis dengan yang dikirim dari PaymentView (nomorPesanan)
  nomorPesanan: {
    type: [String, Number], // Menerima String atau Number
    required: true,
    default: '-'
  }
});
</script>

<style scoped>
.payment-header {
  margin-bottom: 20px;
}

.payment-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
}

.order-summary {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center; /* Pastikan vertikal rata tengah */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* --- Style Label (Span) --- */
.order-total span,
.order-number span {
  display: block;
  font-size: 0.85rem; /* Sedikit dikecilkan agar kontras dengan isinya */
  color: #888;
  margin-bottom: 4px;
  text-transform: uppercase; /* Agar label terlihat tegas */
  letter-spacing: 0.5px;
}

/* --- Style Harga (Tetap Besar) --- */
.order-total strong {
  display: block;
  font-size: 1.5rem; /* Harga tetap besar */
  font-weight: 800;
  color: #2d3748; /* Opsional: Warna hijau biar seperti uang */
}

/* --- Style Nomor Pesanan (DIPERBAIKI) --- */
.order-number strong {
  display: block;
  font-size: 1.1rem; /* Lebih kecil dari harga agar rapi */
  font-weight: 600;  /* Tidak terlalu tebal */
  color: #333;
  
  /* Tambahan agar teks panjang rapi */
  letter-spacing: 1px; /* Jarak antar huruf biar kode mudah dibaca */
  font-family: 'Courier New', Courier, monospace; /* Opsional: Font ala tiket */
  background: #e0e0e0; /* Opsional: Background tipis ala label */
  padding: 2px 8px;
  border-radius: 4px;
}

.order-number {
  text-align: right;
  /* padding-right dihapus saja jika menggunakan flex-end atau text-align right */
}
</style>