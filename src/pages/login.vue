<script setup lang="ts">
import { useLogin } from '~/composables/useLogin';
import ButtonTheme from '~/components/ButtonTheme.vue'
import { Eye, EyeOff, User, Lock, LogIn } from '~/composables/useIcons';
import { vAutoAnimate } from '@formkit/auto-animate';

definePageMeta({
  layout: 'auth',
});

const {
  usuario,
  contraseña,
  showPassword,
  isLoading,
  errorMessage,
  handleLogin
} = useLogin({ redirectTo: '/' });

</script>

<template>
  <div class="bg-[#f2f2f2] dark:bg-gray-900 flex flex-1 items-center justify-center relative w-full overflow-hidden">

    <!-- Botón para cambiar el tema -->
      <ButtonTheme class="absolute top-4 right-4 z-10" />

    <!-- Caja de login con animación -->
    <div ref="formRef" v-auto-animate
      class="w-full max-w-xs sm:max-w-sm md:max-w-sm p-3 sm:p-4 space-y-6 bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow-xl border-2"
      :style="{ 'border-color': '#4CAF50' }">

      <!-- Logo -->
      <div class="flex justify-center mb-4">
        <!-- Logo claro (visible solo en modo claro) -->
        <img
          src="https://res.cloudinary.com/dobkjiqyn/image/upload/v1744161514/icono_web_wxpf7m.webp"
          alt="Logo Claro" class="h-36 w-auto block dark:hidden" />

        <!-- Logo oscuro (visible solo en modo oscuro) -->
        <img
          src="https://res.cloudinary.com/dobkjiqyn/image/upload/v1745279295/WAWAW_Mesa_de_trabajo_1_dg5svu.webp"
          alt="Logo Oscuro" class="h-36 w-auto hidden dark:block" />
      </div>

      <!-- Línea divisoria -->
      <div class="border-t border-[#4CAF50] opacity-50 mx-4" style="height: 1px; margin: 12px 0;"></div>

      <!-- Formulario de inicio de sesión -->
      <div class="space-y-6">
        <div class="relative">
          <label for="usuario" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Usuario o correo
          </label>
          <div class="relative">
            <!-- Icono de usuario dentro del input -->
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300">
              <User class="w-5 h-5" />
            </div>
            <input id="usuario" v-model="usuario" type="text" placeholder="Ingrese su usuario o correo"
              aria-label="Usuario" :aria-invalid="errorMessage ? 'true' : 'false'"
              class="w-full px-4 py-2 pl-10 bg-gray-50 dark:bg-gray-700 text-black dark:text-white border border-[#4CAF50] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] placeholder-gray-400 transition-all duration-200 ease-in-out" />
          </div>
        </div>

        <div class="relative">
          <label for="contraseña" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contraseña
          </label>
          <div class="relative">
            <!-- Icono de candado dentro del input -->
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300">
              <Lock class="w-5 h-5" />
            </div>
            <input :type="showPassword ? 'text' : 'password'" id="contraseña" v-model="contraseña"
              placeholder="Ingrese su contraseña" aria-label="Contraseña"
              :aria-invalid="errorMessage ? 'true' : 'false'"
              class="w-full px-4 py-2 pl-10 pr-10 bg-gray-50 dark:bg-gray-700 text-black dark:text-white border border-[#4CAF50] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] placeholder-gray-400 transition-all duration-200 ease-in-out" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 hover:text-[#4CAF50] focus:outline-none">
              <span v-if="showPassword">
                <EyeOff class="w-6 h-6" />
              </span>
              <span v-else>
                <Eye class="w-6 h-6" />
              </span>
            </button>
          </div>
        </div>
      </div>

      <button @click="handleLogin" :disabled="isLoading"
        class="w-full py-2 text-white font-semibold rounded-lg bg-gradient-to-r from-[#4CAF50] via-[#388E3C] to-[#2C6B2F] hover:from-[#388E3C] hover:to-[#4CAF50] focus:outline-none disabled:opacity-50 transition-all duration-300 ease-in-out flex items-center justify-center space-x-2">
        <LogIn class="w-5 h-5" />
        <span>{{ isLoading ? 'Cargando...' : 'Acceder' }}</span>
      </button>

      <p v-if="errorMessage" class="text-center text-red-500 mt-4">{{ errorMessage }}</p>
    </div>
  </div>
</template>
