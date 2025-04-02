<template>
  <div id="app" class="dark bg-gray-900 text-white min-h-screen">
    <header class="flex justify-between items-center px-6 py-4 border-b border-gray-700">
      <h1 class="text-xl font-bold text-blue-400">FletesPro 🚛</h1>
      <div>
        <template v-if="usuario">
          <span class="mr-4 text-sm">👤 {{ usuario.nombre }}</span>
          <button @click="cerrarSesion" class="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm">
            Cerrar sesión
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="text-blue-400 hover:underline mr-4 text-sm">Iniciar sesión</router-link>
          <router-link to="/register" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm">
            Registrarse
          </router-link>
        </template>
      </div>
    </header>

    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = ref(null)

onMounted(() => {
  const datos = localStorage.getItem('usuario')
  if (datos) {
    usuario.value = JSON.parse(datos)
  }
})

function cerrarSesion() {
  localStorage.removeItem('usuario')
  router.push('/')
  location.reload()
}
</script>

<style>
body {
  @media (prefers-color-scheme: dark) {
    background-color: #111827;
    color: white;
  }
}

a {
  text-decoration: none;
}
</style>
