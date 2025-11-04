<template>
  <div id="app-wrapper">
    <Navbar /> 
    
    <main class="main-content">
      <RouterView /> 
    </main>
    
    <Footer /> 
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue' 
import Footer from './components/Footer.vue' 
</script>

<style>
@import './assets/main.css';

#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 80px; /* Adjust based on your navbar height */
  padding-bottom: 40px;
}

@media (max-width: 1024px) {
  .main-content {
    padding-top: 70px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding-top: 60px;
  }
}
</style>