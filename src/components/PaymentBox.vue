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
    </div>
  </section>
</template>

<script setup>
import { defineProps } from 'vue';

// Definisikan props yang dibutuhkan
defineProps({
  title: {
    type: String,
    required: true,
    default: 'Pembayaran' // Default jika lupa diisi
  },
  totalPrice: {
    type: String,
    required: true,
    default: 'Rp. 0,-'
  },
  orderNumber: {
    type: [String, Number], // Bisa String atau Number
    required: true,
    default: 42
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
  color: #333; /* Sesuaikan warna */
}

.order-summary {
  background-color: #f7f7f7; /* Warna abu-abu muda di gambar */
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Sedikit shadow */
  position: relative; /* Untuk penempatan order-number-value */
}

.order-total span,
.order-number span {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 5px;
}

.order-total strong {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
}

.order-number {
  text-align: right;
  padding-right: 50px; /* Jarak untuk Nomor Pesanan */
}

</style>