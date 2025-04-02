<template>
  <div class="text-center mt-16 px-4 text-gray-800 dark:text-gray-100">
    <div class="inline-block mb-6">
      <svg class="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m-7 8a9 9 0 1118 0 9 9 0 01-18 0z" />
      </svg>
    </div>

    <h2 class="text-3xl font-bold text-green-500">¡Gracias por tu solicitud, {{ nombre }}!</h2>

    <p class="mt-4 text-lg">
      Tu flete hacia <strong>{{ destino }}</strong> ha sido registrado con éxito.
    </p>

    <p class="mt-2 text-gray-700 dark:text-gray-300">
      Número de seguimiento: <strong>#{{ idSeguimiento }}</strong>
    </p>

    <p class="mt-2 text-gray-700 dark:text-gray-300">
      ⏱️ Te contactaremos en menos de <strong>15 minutos</strong>.
    </p>

    <p class="mt-2 text-gray-600 dark:text-gray-400 italic">
      Recibirás una confirmación por WhatsApp {{ email ? 'y por correo electrónico.' : 'pronto.' }}
    </p>

    <div class="mt-6 space-y-4">
      <router-link to="/">
        <button class="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Volver al inicio
        </button>
      </router-link>

      <a
        :href="whatsappLink"
        target="_blank"
        class="block mx-auto text-sm text-green-500 hover:underline"
      >
        📤 Compartir esta solicitud por WhatsApp
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const nombre = ref('')
const destino = ref('')
const email = ref('')
const idSeguimiento = ref('')
const whatsappLink = ref('')

onMounted(() => {
  nombre.value = localStorage.getItem('flete_nombre') || 'cliente'
  destino.value = localStorage.getItem('flete_destino') || 'tu destino'
  email.value = localStorage.getItem('flete_email') || ''
  idSeguimiento.value = localStorage.getItem('flete_id') || 'No disponible'

  const mensaje = `🚛 Hola, he solicitado un flete en FletesPro\n\n🧾 ID: #${idSeguimiento.value}\n📍 Hacia: ${destino.value}`
  whatsappLink.value = `https://wa.me/?text=${encodeURIComponent(mensaje)}`

  localStorage.removeItem('flete_nombre')
  localStorage.removeItem('flete_destino')
  localStorage.removeItem('flete_email')
  localStorage.removeItem('flete_id')
})
</script>
