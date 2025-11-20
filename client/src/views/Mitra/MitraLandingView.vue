<script setup>
import { useRouter } from 'vue-router';
import './MitraLanding.style.css';

const router = useRouter();

function goToRegistration() {
  router.push({ name: 'mitra-register' }); // Pastikan nama route ini sesuai router/index.js kamu
}
</script>

<template>
  <main class="mitra-landing-wrapper">
    <div class="mitra-hero-section">
      <h1 class="mitra-hero-title">Jadilah Mitra Kami</h1>
      <p class="mitra-hero-subtitle">
        Kelola pemancingan Anda dengan lebih mudah, jangkau lebih banyak pelanggan,
        dan tingkatkan pendapatan bisnis Anda bersama kami.
      </p>

      <div class="mitra-benefit-cards">
        <div class="mitra-benefit-item">
          <h3>Akses Luas</h3>
          <p>Jangkau ribuan pemancing dari berbagai kota.</p>
        </div>
        <div class="mitra-benefit-item">
          <h3>Kelola Mudah</h3>
          <p>Sistem manajemen booking yang simpel dan efisien.</p>
        </div>
        <div class="mitra-benefit-item">
          <h3>Pembayaran Aman</h3>
          <p>Sistem pembayaran terintegrasi dan transparan.</p>
        </div>
      </div>

      <button class="mitra-cta-button" @click="goToRegistration">
        Daftarkan Properti Anda
      </button>
    </div>
  </main>
</template>
