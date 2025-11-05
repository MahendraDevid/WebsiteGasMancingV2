<script setup>
import { ref } from 'vue'
// 1. Impor RouterLink untuk penggunaan di template
import { RouterLink } from 'vue-router'

const isMenuOpen = ref(false)
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        <div class="logo-icon">
          <img src="/img/logo.png" alt="Gas Mancing Logo" class="logo-image-file" />
        </div>
        <span class="logo-text">Gas Mancing</span>
      </router-link>
      <button class="menu-toggle" @click="isMenuOpen = !isMenuOpen">
        <span></span><span></span><span></span>
      </button>
      <nav class="menu-desktop">
        <router-link to="/" class="menu-item">Beranda</router-link>
        <router-link to="/pesanan" class="menu-item">Pesanan Saya</router-link>
        <router-link to="/ensiklopedia" class="menu-item">Ensiklopedia</router-link>
      </nav>
      <div class="auth-buttons">
        <button class="btn-masuk">Masuk</button>
        <button class="btn-daftar">Daftar</button>
      </div>
    </div>
  </header>

  <nav :class="['menu-mobile', { active: isMenuOpen }]">
    <button class="menu-close" @click="isMenuOpen = false">&times;</button>

    <!-- 🌟 PERBAIKAN: Menghapus 'Pencarian' dan mengembalikan 'Pesanan Saya' -->
    <router-link to="/" class="menu-item" @click="isMenuOpen = false">Beranda</router-link>
    <a href="#" class="menu-item" @click="isMenuOpen = false">Pesanan Saya</a>
    <router-link to="/ensiklopedia" class="menu-item" @click="isMenuOpen = false">Ensiklopedia</router-link>

    <div class="menu-auth">
      <button class="btn-masuk">Masuk</button>
      <button class="btn-daftar">Daftar</button>
    </div>
  </nav>
</template>

<style scoped>
/* Pindahkan semua style Navbar, Menu, dan Tombol Auth dari main.css ke sini */

.logo-image-file {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

/* --- NAVBAR STYLES --- */
.navbar {
  position: fixed; /* Menggunakan 'fixed' agar selalu di atas */
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: linear-gradient(180deg, rgba(19, 62, 135, 0.95) 0%, rgba(19, 62, 135, 0.85) 100%);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.navbar-container {
  max-width: 1920px;
  margin: 0 auto;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--white);
  font-weight: 700;
  font-size: 24px;
  white-space: nowrap;
  text-decoration: none;
}

.logo-icon {
  position: relative;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 20px;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 101;
}

.menu-toggle span {
  display: block;
  width: 25px;
  height: 3px;
  background-color: var(--white);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.menu-desktop {
  display: flex;
  align-items: right;
  gap: 30px;
  flex: 1;
  justify-content: right;
}

.menu-item {
  color: var(--white);
  text-decoration: none;
  font-size: 18px;
  font-weight: 400;
  padding: 8px 16px;
  transition: all 0.3s ease;
  border-radius: 5px;
  white-space: nowrap;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.btn-masuk,
.btn-daftar {
  padding: 10px 24px;
  font-size: 18px;
  font-weight: 400;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  white-space: nowrap;
}

.btn-masuk {
  background-color: transparent;
  color: var(--white);
  border: 2px solid var(--btn-blue);
}

.btn-masuk:hover {
  background-color: rgba(96, 139, 193, 0.2);
}

.btn-daftar {
  background-color: var(--btn-blue);
  color: var(--white);
}

.btn-daftar:hover {
  background-color: #4f7aa8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* --- MOBILE MENU STYLES --- */
.menu-mobile {
  display: none;
  position: fixed;
  top: 0;
  right: -100%;
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, var(--bay-of-many) 0%, #0d2d5e 100%);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: right 0.3s ease;
  flex-direction: column;
  padding: 80px 30px 30px;
  overflow-y: auto;
}

.menu-mobile.active {
  right: 0;
}

.menu-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  color: var(--white);
  font-size: 36px;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.menu-close:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-mobile .menu-item {
  display: block;
  padding: 15px 20px;
  font-size: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-auth {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-auth .btn-masuk,
.menu-auth .btn-daftar {
  width: 100%;
  text-align: center;
}

/* --- RESPONSIVE NAVBAR --- */
@media (max-width: 1024px) {
  .navbar-container {
    padding: 15px 20px;
  }
  .menu-desktop {
    display: none;
  }
  .menu-toggle {
    display: flex;
  }
  .menu-mobile {
    display: flex;
  }
  .auth-buttons {
    display: none;
  }
  .logo-text {
    font-size: 18px;
  }
}

@media (max-width: 480px) {
  .navbar-container {
    padding: 12px 15px;
  }
  .logo {
    font-size: 16px;
  }
  .logo-icon {
    width: 32px;
    height: 32px;
  }
}

@media (min-width: 1920px) {
  .navbar-container {
    max-width: 1920px;
  }
}
</style>

