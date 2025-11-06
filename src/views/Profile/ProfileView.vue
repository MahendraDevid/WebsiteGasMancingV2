<template>
  <div>
    <div class="edit-profile-wrapper">
      <div class="edit-profile-card">
        <img src="/img/ikan.png" alt="Logo Ikan" class="profile-icon">
        <h2>Edit Profile</h2>

        <form @submit.prevent="handleSubmit" class="edit-form">
          <label>Email</label>
          <input type="email" v-model="email" required />

          <label>Username</label>
          <input type="text" v-model="username" required />

          <label>Nomor Telepon</label>
          <input type="tel" v-model="phone" required />

          <label>Password</label>
          <input type="password" v-model="password" required />

          <button type="submit" class="btn-save">Simpan</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import './ProfileView.style.css'

const email = ref('')
const username = ref('')
const phone = ref('')
const password = ref('')

const handleSubmit = () => {
  alert('Profil berhasil disimpan!')
}
</script>