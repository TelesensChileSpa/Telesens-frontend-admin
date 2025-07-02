export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig();

  const cookie = useCookie<string | null>('token', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  const token = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  onMounted(() => {
    if (process.client) {
      token.value = cookie.value;
    }
  });

  async function login(creds: { usuario: string; contraseña: string }) {
    const API_URL = `${config.public.apiBase}/api`;

    try {
      const response = await $fetch<{ accessToken: string }>(
        `${API_URL}/auth/login`,
        {
          method: 'POST',
          body: creds,
          credentials: 'include',
        }
      );

      if (!response || !response.accessToken) {
        throw new Error('No se recibió el token del servidor.');
      }

      token.value = response.accessToken;
      cookie.value = response.accessToken;
    } catch (error: any) {
      if (error?.message?.includes('NetworkError') || error?.status === 0) {
        throw new Error('No se pudo conectar al servidor.');
      }
      if (error?.status === 401) {
        throw new Error('Usuario o contraseña incorrectos.');
      } else if (error?.status === 400) {
        throw new Error('Solicitud inválida. Revise los campos ingresados.');
      } else if (error?.status === 500) {
        throw new Error('Error interno del servidor. Intente más tarde.');
      } else if (error?.message) {
        throw new Error(error.message);
      }

      throw new Error('Ocurrió un error inesperado al iniciar sesión.');
    }
  }

  function validarCredenciales(usuario: string, contraseña: string) {
    if (!usuario && !contraseña) {
      throw new Error('Ingrese su usuario y contraseña.');
    }
    if (!usuario) {
      throw new Error('Ingrese su usuario o correo.');
    }
    if (!contraseña) {
      throw new Error('Ingrese su contraseña.');
    }
  }

  function logout() {
    token.value = null;
    cookie.value = null;
    if (process.client) {
      navigateTo('/login');
    }
  }

  function getToken() {
    return token.value;
  }

  return {
    token,
    isAuthenticated,
    login,
    logout,
    getToken,
    validarCredenciales,
  };
});