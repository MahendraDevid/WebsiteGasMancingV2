<template>
  <ProfileModal :is-visible="showModal" @close="showModal = false">
    <template #default>
      <div class="profile-modal-content">
        <div class="user-info">
          <p class="user-name">Nama Pengguna</p>
          <p class="user-email">email@example.com</p>
          <p class="user-phone">0812-3456-7890</p>
        </div>

        <div class="action-section">
          <a href="#" class="profile-action-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-fish"><path d="M12.58 6.57C12.73 5.92 12.39 5.23 11.75 5.09a7.99 7.99 0 00-6.75-2.09c-.93.24-1.6.43-2.07.64C2.37 4 1.3 5.42 1 6.57l2.25 4.14c.15.28.42.48.74.55l3.52.79c.14.03.29.05.44.05s.3-.02.44-.05l3.52-.79a.83.83 0 00.74-.55z"></path><path d="M17.25 10.3c.09-.34.14-.68.14-1.03 0-.74-.23-1.44-.64-2.02l-2.73-3.83c-.31-.44-.79-.7-1.3-.7s-.99.26-1.3.7l-2.73 3.83c-.41.58-.64 1.28-.64 2.02 0 .35.05.69.14 1.03l2.27 4.19c.15.28.42.48.74.55l3.52.79c.14.03.29.05.44.05s.3-.02.44-.05l3.52-.79c.32-.07.59-.27.74-.55l2.27-4.19c.09-.34.14-.68.14-1.03 0-.74-.23-1.44-.64-2.02l-2.73-3.83c-.31-.44-.79-.7-1.3-.7s-.99.26-1.3.7z"></path></svg>
            <span>Log Out</span>
          </a>
          <a href="#" class="profile-action-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-fish"><path d="M12.58 6.57C12.73 5.92 12.39 5.23 11.75 5.09a7.99 7.99 0 00-6.75-2.09c-.93.24-1.6.43-2.07.64C2.37 4 1.3 5.42 1 6.57l2.25 4.14c.15.28.42.48.74.55l3.52.79c.14.03.29.05.44.05s.3-.02.44-.05l3.52-.79a.83.83 0 00.74-.55z"></path><path d="M17.25 10.3c.09-.34.14-.68.14-1.03 0-.74-.23-1.44-.64-2.02l-2.73-3.83c-.31-.44-.79-.7-1.3-.7s-.99.26-1.3.7l-2.73 3.83c-.41.58-.64 1.28-.64 2.02 0 .35.05.69.14 1.03l2.27 4.19c.15.28.42.48.74.55l3.52.79c.14.03.29.05.44.05s.3-.02.44-.05l3.52-.79c.32-.07.59-.27.74-.55l2.27-4.19c.09-.34.14-.68.14-1.03 0-.74-.23-1.44-.64-2.02l-2.73-3.83c-.31-.44-.79-.7-1.3-.7s-.99.26-1.3.7z"></path></svg>
            <span>Edit Profile</span>
          </a>
        </div>
      </div>
      </template>
  </ProfileModal>

  </template>

<script setup>
import { ref } from 'vue';
import ProfileModal from './ProfileModal.vue';

const showModal = ref(false);

// Contoh data, ganti dengan data dinamis Anda
const userName = ref("Nama Pengguna");
const userEmail = ref("email@example.com");
const userPhone = ref("0812-3456-7890");

// ... fungsi lainnya ...
</script>

<style scoped>
/* Tambahkan style untuk konten modal Anda di sini */
.profile-modal-content {
  display: flex;
  flex-direction: column;
}

.user-info {
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  margin-bottom: 15px;
  text-align: left; /* Align teks ke kiri */
}

.user-info p {
  margin: 0 0 8px 0; /* Sesuaikan margin antar info */
  font-size: 16px;
  color: #333;
}

.user-name {
  font-weight: 600;
  color: #1a202c;
}

.user-email, .user-phone {
  color: #555;
}

.action-section {
  display: flex;
  flex-direction: column;
}

.profile-action-item {
  display: flex;
  align-items: center;
  gap: 10px; /* Jarak antara ikon dan teks */
  padding: 10px 0;
  color: #3498db; /* Warna teks link */
  text-decoration: none;
  font-weight: 500;
  font-size: 16px;
  transition: background-color 0.2s, color 0.2s;
  border-radius: 4px;
}

.profile-action-item:hover {
  background-color: #f0f8ff; /* Latar belakang saat hover */
  color: #2980b9;
}

.icon-fish {
  stroke: #3498db; /* Warna ikon */
}

.profile-action-item:hover .icon-fish {
  stroke: #2980b9; /* Warna ikon saat hover */
}
</style>