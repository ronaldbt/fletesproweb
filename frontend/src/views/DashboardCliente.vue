<template>
    <div class="max-w-4xl mx-auto p-6 text-white">
      <h1 class="text-2xl font-bold mb-4">📋 Mis Solicitudes de Flete</h1>
  
      <div v-if="fletes.length === 0" class="text-gray-400">
        Aún no has hecho ninguna solicitud de flete.
      </div>
  
      <ul v-else class="space-y-4">
        <li v-for="flete in fletes" :key="flete.id" class="bg-gray-800 p-4 rounded shadow">
          <p><strong>🆔 ID:</strong> {{ flete.id }}</p>
          <p><strong>📍 Origen:</strong> {{ flete.origen }}</p>
          <p><strong>📦 Destino:</strong> {{ flete.destino }}</p>
          <p><strong>💰 Precio:</strong> ${{ flete.precio.toLocaleString() }} CLP</p>
          <p><strong>📅 Fecha:</strong> {{ flete.fecha }}</p>
          <p><strong>🚚 Ayudante:</strong> {{ flete.ayudante ? 'Sí' : 'No' }}</p>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const fletes = ref([])
  
  onMounted(async () => {
    const clienteId = localStorage.getItem('cliente_id')
    if (!clienteId) return
  
    try {
      const res = await fetch(`http://localhost:3001/api/fletes-cliente/${clienteId}`)
      const data = await res.json()
      fletes.value = data.fletes || []
    } catch (err) {
      console.error('❌ Error al obtener fletes del cliente:', err)
    }
  })
  </script>
  