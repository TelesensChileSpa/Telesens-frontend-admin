import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';  // Cambié el import para usar el store de Pinia
import { useRouter } from 'vue-router';

export function useLogin({ redirectTo = '/users' } = {}) {
  const usuario = ref('');
  const contraseña = ref('');
  const isLoading = ref(false);
  const errorMessage = ref('');
  const showPassword = ref(false);

  const authStore = useAuthStore();  // Usamos el store para acceso a la autenticación
  const router = useRouter();

  const handleLogin = async () => {
    isLoading.value = true;
    errorMessage.value = '';

    if (!usuario.value || !contraseña.value) {
      errorMessage.value = 'Por favor, complete todos los campos.';
      isLoading.value = false;
      return;
    }

    try {
      // Llamamos al método login del store de Pinia
      await authStore.login({ usuario: usuario.value, contraseña: contraseña.value });
      router.push(redirectTo);
    } catch (error: any) {
      errorMessage.value = error?.message || 'Credenciales incorrectas';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    usuario,
    contraseña,
    showPassword,
    isLoading,
    errorMessage,
    handleLogin
  };
}