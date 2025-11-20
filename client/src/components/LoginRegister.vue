<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal" role="dialog"
    :aria-labelledby="modalId + '-title'">
    <div class="login-container" ref="container">

      <div class="modal-header">
        <h2 :id="modalId + '-title'" class="masuk-akun">{{ title }}</h2>
        <button class="close-button" @click="closeModal" aria-label="Close modal">&times;</button>
      </div>

      <form @submit.prevent="handleAuth" class="form-content" novalidate>

        <!-- ERROR -->
        <div v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</div>

        <!-- REGISTER FORM -->
        <template v-if="modalType === 'register'">
          <div class="input-group">
            <label class="label-text">Nama Lengkap</label>
            <input type="text" class="input-card" v-model.trim="namaLengkap" required />
          </div>

          <div class="input-group">
            <label class="label-text">Email</label>
            <input type="email" class="input-card" v-model.trim="email" required />
          </div>

          <div class="input-group password-group">
            <label class="label-text">Password</label>
            <div class="password-row">
              <input :type="showPassword ? 'text' : 'password'" class="input-card" v-model="password" required />
              <button type="button" class="pwd-toggle" @click="togglePassword">
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="input-group">
            <label class="label-text">Konfirmasi Password</label>
            <input :type="showPassword ? 'text' : 'password'" class="input-card" v-model="konfirmasiPassword"
              required />
          </div>
        </template>

        <!-- LOGIN FORM -->
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
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>
        </template>

        <!-- Submit -->
        <button type="submit" class="login-button" :disabled="loading">
          <span v-if="loading">Memproses…</span>
          <span v-else-if="modalType === 'login'">Masuk</span>
          <span v-else>Daftar</span>
        </button>
      </form>

      <!-- SWITCH LOGIN <-> REGISTER -->
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

const props = defineProps({
  isVisible: Boolean,
  title: String,
  modalType: String, // controlled by App.vue
})

const emit = defineEmits(['close', 'login', 'register', 'openModal'])

const email = ref('')
const password = ref('')
const namaLengkap = ref('')
const konfirmasiPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const modalId = 'login-modal-' + uuidv4()

// Reset form whenever opened
watch(() => props.isVisible, (open) => open && resetForm())

function resetForm() {
  email.value = ''
  password.value = ''
  namaLengkap.value = ''
  konfirmasiPassword.value = ''
  showPassword.value = false
  errorMessage.value = ''
  loading.value = false
}

function togglePassword() {
  showPassword.value = !showPassword.value
}

// 🔥 FIXED SWITCH — NO INTERNAL STATE
function switchModal() {
  const next = props.modalType === "login" ? "register" : "login"
  emit("openModal", next)
  resetForm()
}

const closeModal = () => {
  emit('close')
  resetForm()
}

function showError(msg) {
  errorMessage.value = msg
}

async function handleAuth() {
  errorMessage.value = ''

  if (props.modalType === 'register') {
    if (!namaLengkap.value || !email.value || !password.value || !konfirmasiPassword.value) {
      return showError('Lengkapi semua field pendaftaran.')
    }
    if (password.value !== konfirmasiPassword.value) {
      return showError('Password tidak cocok.')
    }
    if (password.value.length < 6) {
      return showError('Password minimal 6 karakter.')
    }

    emit('register', {
      nama_lengkap: namaLengkap.value,
      email: email.value,
      password: password.value,
    })
  } else {
    if (!email.value || !password.value) {
      return showError('Lengkapi email dan password.')
    }

    emit('login', {
      email: email.value,
      password: password.value,
    })
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
  transform: scale(1);
  transition: transform 0.2s ease;
}

.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 18px;
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
  transition: border-color 0.15s, box-shadow 0.15s;
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

.pwd-toggle:hover {
  transform: scale(1.02);
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

/* Responsive */
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
