import { io, Socket } from 'socket.io-client'
import { ref, onMounted } from 'vue'
import { useRuntimeConfig } from '#app'
import { useAuthStore } from '~/stores/auth'
import type { ServerToClientEvents, ClientToServerEvents } from '~/interfaces/socket.user.interface'

const socket = ref<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null)
const isConnected = ref(false)
const userId = ref<string | null>(null)

export function useSocket() {
  const auth = useAuthStore()
  const { public: { apiBase } } = useRuntimeConfig()

  let isSocketConnected = false

  // Función para conectar al socket
  function connect(token: string) {
    if (socket.value || !token || isSocketConnected) return

    socket.value = io(`${apiBase}/ws-auth`, {
      transports: ['websocket'],
      auth: { token },
    })

    socket.value.on('userLoggedIn', (data) => {
      // Asegurarse de que userId sea un string o null
      userId.value = data.userId || null
      isConnected.value = true
      console.log(`Usuario conectado con ID: ${data.userId}`)
    })

    socket.value.on('userLoggedOut', (data) => {
      userId.value = null
      isConnected.value = false
      console.log(`Usuario desconectado con ID: ${data.userId}`)
    })

    socket.value.on('connect_error', (err) => {
      console.error('Error de conexión:', err)
      isConnected.value = false
      isSocketConnected = false
    })

    socket.value.on('disconnect', (reason) => {
      console.warn('Desconectado:', reason)
      isConnected.value = false
      isSocketConnected = false
    })

    isSocketConnected = true
  }

  // Función para desconectar
  function disconnect() {
    if (!socket.value) return
    socket.value.disconnect()
    socket.value = null
    isConnected.value = false
    userId.value = null
    isSocketConnected = false
  }

  // Conectar cuando el token esté listo (reactivo)
  const token = auth.getToken()

  // Verificación explícita de si token no es null y es un string
  if (token && typeof token === 'string') {
    connect(token)
  }

  // Asegúrate de que este código solo se ejecute en el cliente
  if (process.client) {
    // Reconectar cuando el usuario vuelva a estar online
    window.addEventListener('online', () => {
      if (token && typeof token === 'string' && !isConnected.value) {
        connect(token)
      }
    })
  }

  return { socket, isConnected, userId, disconnect }
}