<script setup>
// 1. Definisikan semua props yang mungkin kita butuhkan
const props = defineProps({
  // 'variant' akan menentukan layout mana yang dipakai
  // 'button' (Layout A), 'checkout' (Layout B), 'info' (Layout C)
  variant: {
    type: String,
    default: 'button' // defaultnya adalah layout tombol penuh
  },
  
  // --- Untuk variant 'button' & 'checkout' ---
  buttonText: {
    type: String,
    default: 'Submit'
  },
  
  // --- Untuk variant 'checkout' & 'info' ---
  leftTitle: {
    type: String,
    default: ''
  },
  leftSubtitle: {
    type: String,
    default: ''
  },
  
  // --- Hanya untuk variant 'info' ---
  rightTitle: {
    type: String,
    default: ''
  }
})

// 2. Definisikan event 'submit'
// Ini agar komponen induk tahu saat tombolnya diklik
const emit = defineEmits(['submit'])

function onButtonClick() {
  // Hanya emit 'submit' jika ada yang "mendengarkan"
  emit('submit')
}
</script>

<template>
  <div class="footer-bar-container">

    <div v-if="variant === 'button'" class="variant-button">
      <button class="footer-button-white" @click="onButtonClick">
        {{ props.buttonText }}
      </button>
    </div>

    <div v-else-if="variant === 'checkout'" class="variant-split">
      <div class="split-left">
        <span class="title-white">{{ props.leftTitle }}</span>
        <span class="subtitle-white">{{ props.leftSubtitle }}</span>
      </div>
      <div class="split-right">
        <button class="footer-button-white" @click="onButtonClick">
          {{ props.buttonText }}
        </button>
      </div>
    </div>

    <div v-else-if="variant === 'info'" class="variant-split">
      <div class="split-left">
        <span class="title-white">{{ props.leftTitle }}</span>
        <span class="subtitle-white">{{ props.leftSubtitle }}</span>
      </div>
      <div class="split-right">
        <span class="title-white-right">{{ props.rightTitle }}</span>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* 'scoped' berarti style ini HANYA berlaku untuk komponen ini */

/* Base container (the blue bar) */
.footer-bar-container {
  background-color: #0D47A1; /* Warna biru tua dari gambar */
  padding: 16px 20px;
  width: 100%;
  box-sizing: border-box; 
  color: white; /* Default warna teks */
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
}

/* === Tombol Putih (dipakai di variant 'button' & 'checkout') === */
.footer-button-white {
  background-color: #FFFFFF;
  color: #0D47A1; /* Teks biru */
  border: none;
  border-radius: 999px; /* Bulat penuh */
  font-size: 16px;
  font-weight: 600;
  padding: 10px 24px;
  margin: 5px;
  cursor: pointer;
  transition: transform 0.2s ease;
}
.footer-button-white:hover {
  transform: scale(1.02);
}

/* --- Layout A (Tombol Penuh) --- */
.variant-button .footer-button-white {
  width: 100%; /* Lebar penuh */
  padding: 14px 20px;
}

/* --- Layout B & C (Split) --- */
.variant-split {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.split-left {
  display: flex;
  flex-direction: column;
}

/* --- Layout B (Tombol Kanan) --- */
.variant-checkout .footer-button-white {
  padding: 12px 32px; /* Tombol lebih kecil */
}

/* --- Teks Info (Layout B & C) --- */
.title-white {
  font-size: 16px;
  font-weight: 600;
}
.subtitle-white {
  font-size: 14px;
  opacity: 0.9; /* Sedikit lebih redup */
}

/* --- Layout C (Info Kanan) --- */
.title-white-right {
  font-size: 16px;
  font-weight: 600;
  text-align: right;
}
</style>