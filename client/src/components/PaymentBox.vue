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
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.order-total span,
.order-number span {
  display: block;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.order-total strong {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #27ae60;
}

.order-number strong {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  letter-spacing: 1px;
  font-family: 'Courier New', Courier, monospace;
  background: #e0e0e0;
  padding: 2px 8px;
  border-radius: 4px;
}

.order-number {
  text-align: right;
}
</style>
