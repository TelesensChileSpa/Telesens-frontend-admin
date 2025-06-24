import { defineStore } from 'pinia'
import { useCookie, useRuntimeConfig, navigateTo } from '#app'
import { ref, computed, onMounted } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const cookie = useCookie<string | null>('token', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  })

  // Usamos ref para token, lo que permite la reactividad
  const token = ref<string | null>(null)

  // Computed para verificar si el usuario está autenticado
  const isAuthenticated = computed(() => !!token.value)

  // Inicializar el token, asegurándonos de que solo se ejecute en el cliente
  onMounted(() => {
    if (process.client) {
      token.value = cookie.value
    }
  })

  // Función para manejar el login
  async function login(creds: { usuario: string; contraseña: string }) {
    const API_URL = `${config.public.apiBase}/api`
    const { accessToken } = await $fetch<{ accessToken: string }>(
      `${API_URL}/auth/login`, { method: 'POST', body: creds, credentials: 'include' }
    )
    if (!accessToken) throw new Error('No token recibido')
    token.value = accessToken
    cookie.value = accessToken
  }

  // Función para manejar el logout
  function logout() {
    token.value = null
    cookie.value = null
    if (process.client) {
      navigateTo('/login')
    }
  }

  // Este getter es útil si quieres saber si el token está listo para ser utilizado.
  function getToken() {
    return token.value
  }

  return {
    token,
    isAuthenticated,
    login,
    logout,
    getToken,  // Agregado el getter
  }
})