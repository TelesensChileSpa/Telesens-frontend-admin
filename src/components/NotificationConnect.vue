<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useSocket } from '~/composables/useSocket'

const { socket, userId } = useSocket()
const visible = ref(false)

const showNotification = () => {
  visible.value = true
  setTimeout(() => {
    visible.value = false
  }, 4000)
}

// Escuchar el evento 'userLoggedIn' del socket
socket?.value?.on('userLoggedIn', showNotification)

// Limpiar el listener cuando el componente se desmonte
onUnmounted(() => {
  socket?.value?.off('userLoggedIn', showNotification)
})
</script>

<template>
  <div 
    v-if="visible" 
    class="fixed top-20 left-1/2 transform -translate-x-1/2 p-4 rounded-lg shadow-lg z-50 bg-green-100 transition-opacity duration-300"
  >
    <p class="text-green-600 font-medium">
      ¡Conectado correctamente! Bienvenido {{ userId }}
    </p>
  </div>
</template>
