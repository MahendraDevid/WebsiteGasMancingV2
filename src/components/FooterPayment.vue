<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// === Props ===
const props = defineProps({
  variant: {
    type: String,
    default: 'button' // "button", "checkout", atau "info"
  },
  buttonText: {
    type: String,
    default: 'Submit'
  },
  leftTitle: {
    type: String,
    default: ''
  },
  leftSubtitle: {
    type: String,
    default: ''
  },
  rightTitle: {
    type: String,
    default: ''
  },
  nextRoute: {
    type: String,
    default: '' // contoh: '/payment' atau '/pesanan'
  }
})

// === Emits ===
const emit = defineEmits(['submit'])
const router = useRouter()

// === Loading state ===
const isProcessing = ref(false)

// === Handler tombol ===
async function onButtonClick() {
  if (isProcessing.value) return
  isProcessing.value = true

  if (props.nextRoute) {
    // Simulasi proses singkat agar terasa natural
    await new Promise(resolve => setTimeout(resolve, 600))
    router.push(props.nextRoute)
  } else {
    emit('submit')
  }

  isProcessing.value = false
}
</script>

<template>
  <div class="footer-bar-container">
    <!-- VARIAN 1: Tombol penuh -->
    <div v-if="variant === 'button'" class="variant-button">
      <button class="footer-button-white" :disabled="isProcessing" @click="onButtonClick">
        {{ isProcessing ? 'Memproses...' : props.buttonText }}
      </button>
    </div>

    <!-- VARIAN 2: Split kiri-kanan (checkout style) -->
    <div v-else-if="variant === 'checkout'" class="variant-split">
      <div class="split-left">
        <span class="title-white">{{ props.leftTitle }}</span>
        <span class="subtitle-white">{{ props.leftSubtitle }}</span>
      </div>
      <div class="split-right">
        <button class="footer-button-white" :disabled="isProcessing" @click="onButtonClick">
          {{ isProcessing ? 'Memproses...' : props.buttonText }}
        </button>
      </div>
    </div>

    <!-- VARIAN 3: Info saja -->
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
.footer-bar-container {
  background-color: #0D47A1;
  padding: 16px 20px;
  width: 100%;
  box-sizing: border-box;
  color: white;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
}

.footer-button-white {
  background-color: #FFFFFF;
  color: #0D47A1;
  border: none;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  padding: 10px 24px;
  margin: 5px;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
}
.footer-button-white:hover {
  transform: scale(1.03);
}
.footer-button-white:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.variant-button .footer-button-white {
  width: 100%;
  padding: 14px 20px;
}

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

.title-white {
  font-size: 16px;
  font-weight: 600;
}
.subtitle-white {
  font-size: 14px;
  opacity: 0.9;
}

.title-white-right {
  font-size: 16px;
  font-weight: 600;
  text-align: right;
}
</style>
