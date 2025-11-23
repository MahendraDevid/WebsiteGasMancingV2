<template>
  <div class="edit-profile-wrapper">
    <div class="edit-profile-card">
      <img src="/img/ikan.png" alt="Logo Ikan" class="profile-icon">
      <h2>Edit Profile</h2>

      <form @submit.prevent="handleSubmit" class="edit-form">
        <label for="email">Email</label>
        <input id="email" type="email" v-model="email" required :disabled="true" class="disabled-input" />
        <p class="help-text">Email tidak dapat diubah.</p>

        <label for="username">Nama Lengkap</label>
        <input id="username" type="text" v-model="username" required />

        <label for="phone">Nomor Telepon</label>
        <input id="phone" type="tel" v-model="phone" />

        <label for="password">Ganti Password (Kosongkan jika tidak ingin diubah)</label>
        <input id="password" type="password" v-model="password" />

        <button type="submit" class="btn-save" :disabled="isSubmitting || isLoading">
          {{ isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </form>
    </div>

    <Transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content" :class="{ 'shake-anim': modalType === 'error' }">
          
          <div class="icon-circle" :class="modalType">
            
            <svg v-if="modalType === 'success'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>

            <svg v-else xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>

          <h2 :class="modalType + '-text'">
            {{ modalType === 'success' ? 'Berhasil!' : 'Gagal!' }}
          </h2>
          
          <p>{{ modalMessage }}</p>
          
          <button class="modal-close-btn" @click="closeModal" :class="modalType + '-btn'">
            {{ modalType === 'success' ? 'OK' : 'Tutup' }}
          </button>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '../../stores/authStore';
import api from '@/services/api';
import './ProfileView.style.css'; // Pastikan CSS bawaan Anda tetap ada

const authStore = useAuthStore();

// State Form
const email = ref('');
const username = ref('');
const phone = ref('');
const password = ref(''); 

// State Status
const isLoading = ref(true);
const isSubmitting = ref(false);

// State Modal
const showModal = ref(false);
const modalType = ref('success'); // 'success' atau 'error'
const modalMessage = ref('');

const currentUserId = authStore.currentUser?.id_pengguna;

const loadUserData = () => {
    if (authStore.currentUser) {
        email.value = authStore.currentUser.email || '';
        username.value = authStore.currentUser.nama_lengkap || '';
        phone.value = authStore.currentUser.no_telepon || '';
    } else {
        triggerModal('error', 'Anda harus login untuk mengedit profil.');
    }
    isLoading.value = false;
};

// =======================================================
// FUNGSI: Kontrol Modal
// =======================================================
const triggerModal = (type, message) => {
    modalType.value = type;
    modalMessage.value = message;
    showModal.value = true;

    // Jika sukses, tutup otomatis setelah 2 detik (opsional)
    if (type === 'success') {
        setTimeout(() => {
            // Uncomment baris bawah jika ingin auto-close
            // closeModal(); 
        }, 3000);
    }
};

const closeModal = () => {
    showModal.value = false;
};

// =======================================================
// FUNGSI: Submit
// =======================================================
const handleSubmit = async () => {
    if (isSubmitting.value) return;

    if (!currentUserId) {
        triggerModal('error', 'Sesi habis. Mohon login kembali.');
        return;
    }

    isSubmitting.value = true;

    const updateData = {
        nama_lengkap: username.value,
        no_telepon: phone.value,
    };

    if (password.value) {
        updateData.password_hash = password.value;
    }

    try {
        const response = await api.updateUser(currentUserId, updateData);

        if (response.data.success) {
            authStore.updateProfile({
                nama_lengkap: updateData.nama_lengkap,
                no_telepon: updateData.no_telepon,
            });
            
            password.value = '';
            // TAMPILKAN MODAL SUKSES
            triggerModal('success', response.data.message || 'Profil berhasil diperbarui!');
        } else {
            // TAMPILKAN MODAL ERROR DARI API
            triggerModal('error', response.data.error || 'Gagal memperbarui profil.');
        }
    } catch (error) {
        console.error("Gagal update:", error);
        const errorMessage = error.response?.data?.error || 'Terjadi kesalahan sistem.';
        // TAMPILKAN MODAL ERROR CATCH
        triggerModal('error', errorMessage);
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(() => {
    loadUserData();
});
</script>