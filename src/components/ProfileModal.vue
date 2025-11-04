<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-mask" @click.self="$emit('close')">
      <div class="modal-wrapper">
        <div class="modal-container">
          <slot></slot>
          
</div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

defineEmits(['close']);
</script>

<style scoped>
/* Modal Overlay/Mask */
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  transition: opacity 0.3s ease;
}

/* Modal Content Container */
.modal-wrapper {
  flex-grow: 1;
}

.modal-container {
  width: 280px;
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  margin: 65px 20px 0 auto;
  position: relative;
}

/* Arrowhead */
.modal-container::before {
  content: '';
  position: absolute;
  top: -15px; 
  right: 15px;
  border-width: 0 15px 15px 15px;
  border-style: solid;
  border-color: transparent transparent #fff transparent;
  filter: drop-shadow(0 -2px 2px rgba(0,0,0,0.1));
}

/* Sembunyikan footer bawaan */
.modal-footer {
  display: none;
}

/* Vue Transition CSS */
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: translateY(0);
  transform: translateY(0);
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: translateY(-20px);
  transform: translateY(-20px);
  opacity: 0;
}
</style>