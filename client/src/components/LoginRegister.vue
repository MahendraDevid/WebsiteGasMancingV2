<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal" role="dialog"
    :aria-labelledby="modalId + '-title'">
    <div class="login-container" ref="container">

      <div class="modal-header">
        <h2 :id="modalId + '-title'" class="masuk-akun">{{ title }}</h2>
        <button class="close-button" @click="closeModal" aria-label="Close modal">&times;</button>
      </div>

      <div class="role-tabs">
        <button type="button" class="role-btn" :class="{ active: userRole === 'user' }" @click="userRole = 'user'">
          Pelanggan
        </button>
        <button type="button" class="role-btn" :class="{ active: userRole === 'mitra' }" @click="userRole = 'mitra'">
          Mitra
        </button>
      </div>

      <div v-if="modalType === 'register' && userRole === 'mitra'" class="mitra-redirect-box">
        <div class="mitra-content">
          <svg class="mitra-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>

          <h3>Gabung Jadi Mitra</h3>
          <p>Daftarkan tempat pemancingan Anda, kelola booking dengan mudah, dan dapatkan lebih banyak pelanggan.</p>

          <button @click="goToMitraPage" class="login-button secondary-btn">
            Isi Formulir Pendaftaran Mitra
          </button>
        </div>
      </div>

      <form v-else @submit.prevent="handleAuth" class="form-content" novalidate>
        <div v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</div>

        <template v-if="modalType === 'register' && userRole === 'user'">
          <div class="input-group">
            <label class="label-text">Nama Lengkap</label>
            <input type="text" class="input-card" v-model.trim="namaLengkap" required />
          </div>
          <div class="input-group">
            <label class="label-text">Email</label>
            <input type="email" class="input-card" v-model.trim="email" required />
          </div>
          <div class="input-group">
            <label class="label-text">Nomor Telepon</label>
            <input type="tel" class="input-card" v-model.trim="noTelepon" required placeholder="Contoh: 0812..." />
          </div>
          <div class="input-group password-group">
            <label class="label-text">Password</label>
            <div class="password-row">
              <input :type="showPassword ? 'text' : 'password'" class="input-card" v-model="password" required />
              <button type="button" class="pwd-toggle" @click="togglePassword">
                <img :src="showPassword ? IconEyeOpen : IconEyeClosed" alt="toggle password" class="pwd-icon" />
              </button>
            </div>
          </div>
          <div class="input-group">
            <label class="label-text">Konfirmasi Password</label>
            <input :type="showPassword ? 'text' : 'password'" class="input-card" v-model="konfirmasiPassword"
              required />
          </div>
        </template>

        <template v-if="modalType === 'login'">
          <div class="input-group">
            <label class="label-text">Email</label>
            <input type="email" class="input-card" v-model.trim="email" required />
          </div>

          <div class="input-group password-group">
            <label class="label-text">Password</label>
            <div class="password-row">
              <input :type="showPassword ? 'text' : 'password'" class="input-card" v-model="password" required />
              <button type="button" class="pwd-toggle" @click="togglePassword">
                <img :src="showPassword ? IconEyeClosed : IconEyeOpen" alt="toggle" class="pwd-icon" />
              </button>
            </div>
          </div>
        </template>

        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading">Memproses...</span>
          <span v-else>
            {{ modalType === 'login' ? 'Masuk' : 'Daftar' }}
            {{ userRole === 'mitra' ? 'Mitra' : '' }}
          </span>
        </button>
      </form>

      <div class="belum-ada-akun-daftar">
        <span class="span0">
          {{ modalType === 'login' ? "Belum ada akun? " : "Sudah punya akun? " }}
        </span>
        <a href="#" class="span1" @click.prevent="switchModal">
          {{ modalType === 'login' ? "Daftar" : "Masuk" }}
        </a>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import IconEyeOpen from '@/components/icons/IconEyeOpen.png'
import IconEyeClosed from '@/components/icons/IconEyeClosed.png'

const props = defineProps({
  isVisible: Boolean,
  title: String,
  modalType: String,
})

const emit = defineEmits(['close', 'openModal', 'success'])

const authStore = useAuthStore()
const router = useRouter()

// State
const email = ref('')
const password = ref('')
const namaLengkap = ref('')
const noTelepon = ref('')
const konfirmasiPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const modalId = 'login-modal-' + uuidv4()
const userRole = ref('user')

watch(() => props.isVisible, (open) => open && resetForm())

function resetForm() {
  email.value = ''
  password.value = ''
  namaLengkap.value = ''
  noTelepon.value = ''
  konfirmasiPassword.value = ''
  showPassword.value = false
  errorMessage.value = ''
  loading.value = false
}

function togglePassword() { showPassword.value = !showPassword.value }

function switchModal() {
  const next = props.modalType === "login" ? "register" : "login"
  emit("openModal", next)
  resetForm()
}

const closeModal = () => { emit('close'); resetForm(); }
function showError(msg) { errorMessage.value = msg }

function goToMitraPage() {
  closeModal();
  // Pastikan route ini ada di router/index.js
  router.push({ name: 'mitra-register' });
}

async function handleAuth() {
  errorMessage.value = ''
  loading.value = true

  try {
    // REGISTER USER
    if (props.modalType === 'register' && userRole.value === 'user') {
      if (!namaLengkap.value || !email.value || !noTelepon.value || !password.value || !konfirmasiPassword.value) {
        showError('Lengkapi semua field pendaftaran.')
        loading.value = false; return
      }
      if (password.value !== konfirmasiPassword.value) {
        showError('Password tidak cocok.')
        loading.value = false; return
      }

      const result = await authStore.register({
        nama_lengkap: namaLengkap.value,
        email: email.value,
        no_telepon: noTelepon.value,
        password: password.value,
      })

      if (result.success) {
        emit('success', { type: 'register', role: 'user' })
        setTimeout(() => { switchModal() }, 100)
      }

      else {
        showError(result.error || 'Registrasi gagal')
      }
    }
    // LOGIN (User & Mitra)
    else {
      if (!email.value || !password.value) {
        showError('Lengkapi email dan password.'); loading.value = false; return
      }

      let result;
      if (userRole.value === 'mitra') {
        result = await authStore.loginMitra({ email: email.value, password: password.value })
      } else {
        result = await authStore.login({ email: email.value, password: password.value })
      }

      if (result.success) {
        emit('success', { type: 'login', role: userRole.value })
        closeModal()

        // --- Redirect Khusus Mitra ---
        if (userRole.value === 'mitra') {
            // Mengarahkan ke Dashboard Mitra (Pastikan nama route sesuai di index.js)
            router.push({ name: 'mitra-property' });
        }

      } else {
        showError(result.error || 'Login gagal')
      }
    }
  } catch (error) {
    showError('Terjadi kesalahan.')
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:root {
  --white: #ffffff;
  --black: #000000;
  --btn-blue: #608bc1;
  --bay-of-many: #133e87;
  --cultured-pearl: #f5f5f5;
  --dove-gray: #6d6d6d;
  --danger: #d9534f;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1050;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-container {
  background-color: var(--cultured-pearl);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 28px;
  width: 100%;
  max-width: 420px;
  position: relative;
  max-height: 90vh;
  /* Agar tidak kepanjangan di layar kecil */
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.masuk-akun {
  font-size: 22px;
  font-weight: 700;
  color: var(--bay-of-many);
  flex-grow: 1;
  text-align: center;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: var(--dove-gray);
  padding: 4px;
}

/* TABS STYLE */
.role-tabs {
  display: flex;
  background-color: #e0e0e0;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 20px;
}

.role-btn {
  flex: 1;
  border: none;
  background: transparent;
  padding: 10px;
  border-radius: 6px;
  font-weight: 600;
  color: var(--dove-gray);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.role-btn.active {
  background-color: var(--white);
  color: var(--bay-of-many);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* MITRA REDIRECT STYLE */
.mitra-redirect-box {
  text-align: center;
  padding: 30px 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px dashed #ccc;
  margin-bottom: 10px;
}

.mitra-icon {
  width: 60px;
  height: 60px;
  color: var(--btn-blue);
  margin-bottom: 15px;
}

.mitra-content h3 {
  color: var(--bay-of-many);
  margin: 0 0 10px 0;
  font-size: 18px;
}

.mitra-content p {
  color: var(--dove-gray);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 25px;
}

.secondary-btn {
  background-color: #27ae60 !important;
  /* Warna Hijau */
}

.secondary-btn:hover {
  background-color: #219150 !important;
}

/* FORM ELEMENTS */
.form-content {
  margin-top: 6px;
}

.input-group {
  margin-bottom: 14px;
}

.label-text {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--dove-gray);
  font-size: 14px;
}

.input-card {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
}

.input-card:focus {
  outline: none;
  border-color: var(--btn-blue);
  box-shadow: 0 0 0 3px rgba(96, 139, 193, 0.12);
}

.password-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.pwd-toggle {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
}

.login-button {
  width: 100%;
  padding: 12px;
  font-size: 17px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  background-color: var(--btn-blue);
  color: var(--white);
  margin-top: 6px;
}

.login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.belum-ada-akun-daftar {
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: var(--dove-gray);
}

.span1 {
  color: var(--btn-blue);
  font-weight: 600;
  text-decoration: none;
}

.form-error {
  padding: 10px 12px;
  background: rgba(217, 83, 79, 0.08);
  border: 1px solid rgba(217, 83, 79, 0.18);
  color: var(--danger);
  border-radius: 8px;
  margin-bottom: 12px;
  font-size: 14px;
}

.pwd-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

@media (max-width: 480px) {
  .login-container {
    padding: 20px;
    max-width: 380px;
  }

  .masuk-akun {
    font-size: 18px;
  }
}
</style>
