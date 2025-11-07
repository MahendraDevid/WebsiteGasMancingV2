<template>
  <div v-if="isVisible" class="dropdown-overlay" @click.self="$emit('close')">
    
    <div class="dropdown-menu">
      <div class="dropdown-header">
        Akun Saya
      </div>
      <ul class="dropdown-list">
        
        <router-link 
          to="/profile" 
          class="dropdown-item" 
          @click="$emit('close')"
        >
          <span>Edit Profil</span>
        </router-link>

        <li class="dropdown-item logout" @click="$emit('logout')">
          <span>Keluar</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

// BARU: Hapus 'editProfile' dari emits
defineEmits(['close', 'logout'])
</script>

<style scoped>
/* ... (Semua CSS Anda sebelumnya SAMA) ... */
.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1040;
}
.dropdown-menu {
  position: absolute;
  top: 75px; 
  right: 20px; 
  background: var(--white, #ffffff);
  border-radius: 8px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  width: 220px;
  z-index: 1041;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}
.dropdown-header {
  padding: 16px;
  font-weight: 700;
  /* ... (style header) ... */
}
.dropdown-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* BARU: Pastikan router-link di-style sebagai dropdown-item */
.dropdown-item,
.dropdown-item-link { /* Kita gunakan class yang sama */
  padding: 14px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: var(--black, #000000);
  transition: background-color 0.2s ease;
  text-decoration: none; /* Hapus garis bawah link */
}
.dropdown-item:hover,
.dropdown-item-link:hover {
  background-color: var(--cultured-pearl, #f5f5ff);
}
.dropdown-item.logout {
  color: #d9534f;
}
.dropdown-item.logout:hover {
  background-color: #fbeae9;
}
</style>