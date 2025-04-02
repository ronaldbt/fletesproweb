<template>
    <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 class="text-3xl font-bold mb-6">Registro</h1>
  
      <form @submit.prevent="registrarse" class="w-full max-w-md space-y-4 bg-gray-800 p-6 rounded-lg shadow">
        <input
          v-model="nombre"
          type="text"
          placeholder="Nombre completo"
          class="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Correo electrónico (opcional)"
          class="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="telefono"
          type="tel"
          placeholder="Teléfono"
          class="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Contraseña"
          class="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
  
        <select
          v-model="tipo"
          class="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option disabled value="">Selecciona tu rol</option>
          <option value="cliente">Cliente</option>
          <option value="conductor">Conductor</option>
        </select>
  
        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Registrarse
        </button>
      </form>
  
      <router-link to="/login" class="mt-4 text-sm text-blue-400 hover:underline">
        ¿Ya tienes cuenta? Inicia sesión
      </router-link>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const nombre = ref('')
  const email = ref('')
  const telefono = ref('')
  const password = ref('')
  const tipo = ref('')
  const router = useRouter()
  
  async function registrarse() {
    const res = await fetch('http://localhost:3001/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombre.value,
        email: email.value,
        telefono: telefono.value,
        password: password.value,
        tipo: tipo.value
      })
    })
  
    const data = await res.json()
    if (data.mensaje) {
      alert('✅ Registro exitoso, ahora inicia sesión')
      router.push('/login')
    } else {
      alert(data.error || 'Error al registrar')
    }
  }
  </script>
  
  <style scoped>
  /* Puedes dejar este bloque para estilos adicionales si lo necesitas */
  </style>
  