<script setup>
import { defineEmits } from 'vue'

// Emit 'close' to parent when modal is dismissed
const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}

function outsideClick(event) {
  if (event.target.classList.contains('modal')) {
    closeModal()
  }
}
</script>

<template>
  <!-- Modal overlay -->
  <div class="modal" @click="outsideClick">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <h2>Welcome</h2>
      <p>This is your modal content.</p>
    </div>
  </div>
</template>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  position: relative;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.close {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 24px;
  font-weight: bold;
  color: #aaa;
  cursor: pointer;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
}
</style>