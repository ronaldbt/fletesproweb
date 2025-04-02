<template>
    <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-4">
      <h1 class="text-3xl font-bold mb-6">Iniciar Sesión</h1>
  
      <form @submit.prevent="iniciarSesion" class="w-full max-w-md space-y-4 bg-gray-800 p-6 rounded-lg shadow">
        <input
          v-model="email"
          type="email"
          placeholder="Correo electrónico"
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
  
        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Entrar
        </button>
      </form>
  
      <router-link to="/register" class="mt-4 text-sm text-blue-400 hover:underline">
        ¿No tienes cuenta? Regístrate aquí
      </router-link>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const email = ref('')
  const telefono = ref('')
  const password = ref('')
  const router = useRouter()
  
  async function iniciarSesion() {
    const res = await fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, telefono: telefono.value, password: password.value })
    })
  
    const data = await res.json()
    if (data.usuario) {
      localStorage.setItem('usuario', JSON.stringify(data.usuario))
      router.push(data.usuario.tipo === 'conductor' ? '/dashboard-conductor' : '/dashboard-cliente')
    } else {
      alert(data.error || 'Error al iniciar sesión')
    }
  }
  </script>
  
  <style scoped>
  /* Puedes agregar estilos adicionales aquí si quieres */
  </style>
  