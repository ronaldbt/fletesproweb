<template>
    <div class="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 class="text-xl font-semibold mb-4">Reserva tu flete</h2>
      <form @submit.prevent="enviarReserva">
        <input v-model="nombre" type="text" placeholder="Nombre" class="input" />
        <input v-model="telefono" type="tel" placeholder="Teléfono" class="input" />
        <input v-model="origen" type="text" placeholder="Dirección de origen" class="input" />
        <input v-model="destino" type="text" placeholder="Dirección de destino" class="input" />
        <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full mt-4">
          Reservar
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  
  const nombre = ref('')
  const telefono = ref('')
  const origen = ref('')
  const destino = ref('')
  const router = useRouter()
  
  function enviarReserva() {
    // Aquí iría la lógica para enviar al backend (POST)
    console.log({ nombre: nombre.value, telefono: telefono.value, origen: origen.value, destino: destino.value })
  
    // Simulación: ir a la vista de gracias
    router.push('/gracias')
  }
  </script>
  
  <style scoped>
  .input {
    @apply w-full p-2 mb-4 border border-gray-300 rounded;
  }
  </style>
  