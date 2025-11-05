<template>
  <!-- Overlay: Hanya tampil jika isVisible=true. Menggunakan @click.self untuk menutup saat klik latar belakang -->
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="login-container">
      
      <!-- Header dan Tombol Tutup -->
      <div class="modal-header">
        <h2 class="masuk-akun">{{ title }}</h2>
        <button class="close-button" @click="closeModal">&times;</button>
      </div>

      <!-- Form (Untuk Login/Register) -->
      <form @submit.prevent="handleAuth" class="form-content">

        <!-- BARU: Hanya tampil saat registrasi -->
        <div v-if="modalType === 'register'" class="input-group">
          <label for="name" class="label-text">Nama Lengkap</label>
          <input
            id="name"
            type="text"
            class="input-card"
            placeholder="Masukkan Nama Lengkap Anda"
            v-model="namaLengkap"
            required
          />
        </div>

        <!-- Input Email (Tampil di Login & Register) -->
        <div class="input-group">
          <label for="email" class="label-text">Email</label>
          <input
            id="email"
            type="email"
            class="input-card"
            placeholder="Masukkan Email Anda"
            v-model="email"
            required
          />
        </div>

        <!-- Input Password (Tampil di Login & Register) -->
        <div class="input-group">
          <label for="password" class="label-text">Password</label>
          <input
            id="password"
            type="password"
            class="input-card"
            placeholder="Masukkan Password"
            v-model="password"
            required
          />
        </div>

        <!-- BARU: Hanya tampil saat registrasi -->
        <div v-if="modalType === 'register'" class="input-group">
          <label for="confirmPassword" class="label-text">Konfirmasi Password</label>
          <input
            id="confirmPassword"
            type="password"
            class="input-card"
            placeholder="Konfirmasi Password Anda"
            v-model="konfirmasiPassword"
            required
          />
        </div>

        <button type="submit" class="login-button">
          {{ modalType === 'login' ? 'Masuk' : 'Daftar' }}
        </button>
      </form>

      <!-- Tautan Daftar/Login -->
      <div class="belum-ada-akun-daftar">
        <span class="span0">
          {{ modalType === 'login' ? 'Belum ada akun? ' : 'Sudah punya akun? ' }}
        </span>
        <!-- Tautan ini sekarang memicu event 'openModal' di App.vue untuk berganti modal -->
        <a href="#" class="span1" @click.prevent="modalType === 'login' ? $emit('openModal', 'register') : $emit('openModal', 'login')">
          {{ modalType === 'login' ? 'Daftar' : 'Masuk' }}
        </a>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginModal',
  // Props tetap sama
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: 'Masuk Akun',
    },
    modalType: {
      type: String,
      default: 'login',
    },
  },
  // BARU: Tambahkan data untuk field register
  data() {
    return {
      email: '',
      password: '',
      namaLengkap: '', // <-- BARU
      konfirmasiPassword: '', // <-- BARU
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    // BARU: Logika handleAuth diperbarui
    handleAuth() {
      const eventName = this.modalType; // 'login' or 'register'
      let payload = {};

      if (eventName === 'login') {
        payload = {
          email: this.email,
          password: this.password
        };
      } else if (eventName === 'register') {
        // Validasi konfirmasi password
        if (this.password !== this.konfirmasiPassword) {
          alert('Password dan Konfirmasi Password tidak cocok!');
          return; // Hentikan submit jika tidak cocok
        }
        
        payload = {
          namaLengkap: this.namaLengkap,
          email: this.email,
          password: this.password
          // Anda tidak perlu mengirim konfirmasiPassword ke backend
        };
      }
      
      console.log(`Mengeluarkan event: ${eventName}`, payload);
      this.$emit(eventName, payload);
    }
  },
  // BARU: Watch diperbarui untuk reset semua field
  watch: {
    isVisible(newVal) {
      if (newVal) {
        // Reset semua form saat modal dibuka
        this.email = '';
        this.password = '';
        this.namaLengkap = ''; // <-- BARU
        this.konfirmasiPassword = ''; // <-- BARU
      }
    }
  }
};
</script>

<style scoped>
/* CSS Anda (yang sudah ada) tidak perlu diubah. 
   Style .input-group dan .input-card akan otomatis diterapkan pada field baru.
   Pastikan Anda juga memperbaiki .masuk-akun text-align: center dan flex-grow: 1 */

:root {
  --white: #ffffff;
  --black: #000000;
  --btn-blue: #608bc1;
  --bay-of-many: #133e87;
  --cultured-pearl: #f5f5f5;
  --dove-gray: #6d6d6d;
}

/* ... (Semua CSS Anda yang lain) ... */

.modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 25px;
}

.masuk-akun {
  font-size: 24px;
  font-weight: 700;
  color: var(--bay-of-many);
  flex-grow: 1; /* <-- Perbaikan dari sebelumnya */
  text-align: center; /* <-- Perbaikan dari sebelumnya */
}

/* ... (Sisa CSS Anda) ... */
.input-group {
  margin-bottom: 20px;
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
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.input-card:focus {
  outline: none;
  border-color: var(--btn-blue);
  box-shadow: 0 0 0 3px rgba(96, 139, 193, 0.3);
}
.login-button {
  width: 100%;
  padding: 12px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s;
  border: none;
  background-color: var(--btn-blue);
  color: var(--white);
  margin-top: 10px;
}
.login-button:hover {
  background-color: #4f7aa8;
  transform: translateY(-1px);
}
.belum-ada-akun-daftar {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: var(--dove-gray);
}
.span1 {
  color: var(--btn-blue);
  font-weight: 600;
  text-decoration: none;
  transition: opacity 0.2s;
}
.span1:hover {
  opacity: 0.8;
  text-decoration: underline;
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
  opacity: 1; 
  transition: opacity 0.3s ease;
}
.login-container {
  background-color: var(--cultured-pearl);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  padding: 30px;
  width: 90%;
  max-width: 400px;
  position: relative;
  transform: scale(1);
  transition: transform 0.3s ease;
}
.close-button {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: var(--dove-gray);
  line-height: 1;
  padding: 5px;
  transition: color 0.2s;
}
.close-button:hover {
  color: var(--black);
}
@media (max-width: 480px) {
  .login-container {
    padding: 25px 20px;
  }
  .masuk-akun {
    font-size: 20px;
  }
}
</style>