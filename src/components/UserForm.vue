<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { User } from '~/interfaces/user.interface'

const props = defineProps<{
  user?: Partial<User>
  isEditMode: boolean
  clientes: Array<{ _id: string; nombre: string }>
}>()

const emit = defineEmits(['save', 'cancel'])

const localUser = reactive<Partial<User>>({
  nombre: '',
  rut: '',
  correo: '',
  usuario: '',
  contraseña: '',
  direccion: '',
  telefono: '',
  clienteId: '',
  roles: [],
  activo: true,
  ...props.user,
})

watch(() => props.user, (newUser) => {
  Object.assign(localUser, newUser || {})
})

const handleSubmit = () => {
  emit('save', localUser)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Campo: Nombre -->
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
        <input v-model="localUser.nombre" type="text" required
          class="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600" />
      </div>

      <!-- Campo: RUT -->
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">RUT</label>
        <input v-model="localUser.rut" type="text" required
          class="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600" />
      </div>

      <!-- Campo: Correo -->
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo</label>
        <input v-model="localUser.correo" type="email" required
          class="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600" />
      </div>

      <!-- Campo: Usuario -->
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Usuario</label>
        <input v-model="localUser.usuario" type="text" required
          class="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600" />
      </div>

      <!-- Campo: Contraseña -->
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
        <input v-model="localUser.contraseña" :required="!isEditMode" type="password" placeholder="••••••"
          class="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600" />
      </div>

      <!-- Campo: Dirección -->
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección</label>
        <input v-model="localUser.direccion" type="text"
          class="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600" />
      </div>

      <!-- Campo: Teléfono -->
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono</label>
        <input v-model="localUser.telefono" type="text"
          class="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600" />
      </div>

      <!-- Campo: Cliente -->
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cliente</label>
        <select v-model="localUser.clienteId" required
          class="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
          <option disabled value="">Selecciona un cliente</option>
          <option v-for="cliente in clientes" :key="cliente._id" :value="cliente._id">
            {{ cliente.nombre }}
          </option>
        </select>
      </div>

      <!-- Campo: Roles -->
      <div class="flex flex-col">
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Roles</label>
        <select v-model="localUser.roles" multiple
          class="block w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm h-32 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:border-gray-600">
          <option value="administrador">Administrador</option>
          <option value="operador">Operador</option>
          <option value="visor">Visor</option>
        </select>
      </div>

      <!-- Campo: Activo -->
      <div class="flex items-center gap-2 col-span-1 sm:col-span-2 mt-2">
        <input v-model="localUser.activo" type="checkbox" class="h-4 w-4 text-green-600 rounded" />
        <label class="text-sm text-gray-700 dark:text-gray-300">Usuario activo</label>
      </div>
    </div>

    <!-- Fechas (modo edición) -->
    <div v-if="isEditMode" class="text-sm text-gray-500 dark:text-gray-400 space-y-1">
      <p><strong>Creado:</strong> {{ localUser.creado }}</p>
      <p><strong>Actualizado:</strong> {{ localUser.actualizado }}</p>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3">
      <button type="button" @click="$emit('cancel')"
        class="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 dark:bg-gray-700 dark:text-white">
        Cancelar
      </button>
      <button type="submit"
        class="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition">
        {{ isEditMode ? 'Actualizar' : 'Crear' }}
      </button>
    </div>
  </form>
</template>
