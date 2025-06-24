<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useUsers } from '~/composables/useUsers'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'
import type { User } from '~/interfaces/user.interface'
import UserForm from '~/components/UserForm.vue'

const { users, fetchUsers, loading, error } = useUsers()
const { isAuthenticated, token } = useAuthStore()
const router = useRouter()

// Clientes
const clientes = ref<{ _id: string; nombre: string }[]>([])

const fetchClientes = async () => {
  try {
    const data = await $fetch('/api/clientes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    clientes.value = data
  } catch (e) {
    console.error('Error al obtener clientes:', e)
    alert('No se pudieron cargar los clientes.')
  }
}

const searchTerm = ref('')
const debouncedSearch = ref('')
const currentPage = ref(1)
const itemsPerPage = 6

watch(searchTerm, () => {
  clearTimeout((searchTerm as any)._timeout)
  ;(searchTerm as any)._timeout = setTimeout(() => {
    debouncedSearch.value = searchTerm.value
    currentPage.value = 1
  }, 300)
})

const filteredUsers = computed(() =>
  users.value.filter((u) => {
    const term = debouncedSearch.value.toLowerCase()
    return (
      u.nombre?.toLowerCase().includes(term) ||
      u.correo?.toLowerCase().includes(term) ||
      u.usuario?.toLowerCase().includes(term)
    )
  })
)

const totalPages = computed(() =>
  Math.ceil(filteredUsers.value.length / itemsPerPage)
)

const paginatedUsers = computed(() =>
  filteredUsers.value.slice(
    (currentPage.value - 1) * itemsPerPage,
    currentPage.value * itemsPerPage
  )
)


// Modal
const selectedUser = ref<Partial<User> | null>(null)
const showModal = ref(false)
const isEditMode = ref(false)

const openModal = (user: Partial<User> | null = null) => {
  selectedUser.value = user
  isEditMode.value = !!user
  showModal.value = true
}

const closeModal = () => {
  selectedUser.value = null
  isEditMode.value = false
  showModal.value = false
}

// Lifecycle
onMounted(() => {
  if (isAuthenticated) {
    fetchUsers()
    fetchClientes()
  } else {
    router.push('/login')
  }
})

watch(error, (newError) => {
  if (newError) router.push('/login')
})

// Delete
const handleDelete = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    try {
      await $fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchUsers()
    } catch (e) {
      console.error('Error al eliminar usuario:', e)
      alert('No se pudo eliminar el usuario.')
    }
  }
}

// Create / Update
const handleSave = async (userData: Partial<User>) => {
  try {
    const endpoint = isEditMode.value
      ? `/api/users/${selectedUser.value?._id}`
      : `/api/users`

    const method = isEditMode.value ? 'PUT' : 'POST'

    await $fetch(endpoint, {
      method,
      body: userData,
      headers: { Authorization: `Bearer ${token}` }
    })

    await fetchUsers()
    closeModal()
  } catch (e) {
    console.error('Error al guardar usuario:', e)
    alert('No se pudo guardar el usuario.')
  }
}
</script>

<template>
  <div class="flex-1 p-6 space-y-8">
    <!-- Título centrado -->
    <h1 class="text-3xl font-bold text-center text-gray-800 dark:text-white">
      Gestión de Usuarios
    </h1>

    <!-- Barra de búsqueda y botón -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <input
        v-model="searchTerm"
        type="text"
        placeholder="Buscar usuario por nombre o correo..."
        class="w-full sm:w-1/2 p-2 border rounded dark:bg-gray-800 dark:text-white"
      />
      <button
        @click="openModal()"
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        + Agregar Usuario
      </button>
    </div>

    <!-- Contenido -->
    <div v-if="loading" class="text-center text-gray-500 dark:text-gray-300">Cargando...</div>
    <div v-else-if="filteredUsers.length === 0" class="text-center text-gray-500 dark:text-gray-400">
      No se encontraron usuarios.
    </div>

    <!-- Grid de tarjetas -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="user in paginatedUsers"
        :key="user._id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col justify-between"
      >
        <div class="space-y-2">
          <h2 class="text-xl font-semibold text-gray-800 dark:text-white">{{ user.nombre }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ user.correo }}</p>
          <p class="text-sm text-gray-600 dark:text-gray-300">Usuario: {{ user.usuario }}</p>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              v-for="role in user.roles"
              :key="role"
              class="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 px-2 py-0.5 rounded"
            >
              {{ role }}
            </span>
          </div>
          <p class="text-sm mt-1 text-gray-500 dark:text-gray-400">
            Estado:
            <span :class="user.activo ? 'text-green-600' : 'text-red-600'" class="font-semibold">
              {{ user.activo ? 'Activo' : 'Inactivo' }}
            </span>
          </p>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button
            @click="openModal(user)"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Editar
          </button>
          <button
            @click="handleDelete(user._id)"
            class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-6">
      <button
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-3 py-1 text-sm rounded border dark:border-gray-700 dark:text-white"
      >
        Anterior
      </button>
      <span class="text-gray-700 dark:text-gray-300 text-sm">Página {{ currentPage }} de {{ totalPages }}</span>
      <button
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 text-sm rounded border dark:border-gray-700 dark:text-white"
      >
        Siguiente
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-gray-900 p-6 rounded shadow-lg w-full max-w-lg relative">
        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          {{ isEditMode ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h2>

        <UserForm
          :user="selectedUser"
          :isEditMode="isEditMode"
          :clientes="clientes"
          @save="handleSave"
          @cancel="closeModal"
        />
      </div>
    </div>
  </div>
</template>