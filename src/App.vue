<template>
  <div id="app-wrapper">
    <Navbar /> 
    
    <RouterView /> 
    
    <Footer /> 
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
// Pastikan path impor ini benar sesuai lokasi file Anda
import Navbar from './components/Navbar.vue' 
import Footer from './components/Footer.vue' 
</script>

<style>
/* Impor CSS global jika belum dilakukan */
@import './assets/main.css'; 
</style>