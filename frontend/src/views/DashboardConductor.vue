<template>
    <div class="max-w-4xl mx-auto p-6 text-white">
      <h1 class="text-2xl font-bold mb-4">🚛 Fletes Asignados</h1>
  
      <div v-if="fletes.length === 0" class="text-gray-400">
        Aún no tienes fletes asignados.
      </div>
  
      <ul v-else class="space-y-4">
        <li v-for="flete in fletes" :key="flete.id" class="bg-gray-800 p-4 rounded shadow">
          <p><strong>🆔 ID:</strong> {{ flete.id }}</p>
          <p><strong>📍 Origen:</strong> {{ flete.origen }}</p>
          <p><strong>📦 Destino:</strong> {{ flete.destino }}</p>
          <p><strong>💰 Pago a recibir:</strong> ${{ Math.round(flete.precio * 0.9).toLocaleString() }} CLP</p>
          <p><strong>📅 Fecha:</strong> {{ flete.fecha }}</p>
        </li>
      </ul>
  
      <div class="mt-6 text-green-400 font-semibold">
        💸 Tus pagos se procesan todos los miércoles automáticamente.
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const fletes = ref([])
  
  onMounted(async () => {
    const telefono = localStorage.getItem('conductor_telefono')
    if (!telefono) return
  
    try {
      const res = await fetch(`http://localhost:3001/api/fletes-conductor/${telefono}`)
      const data = await res.json()
      fletes.value = data.fletes || []
    } catch (err) {
      console.error('❌ Error al obtener fletes del conductor:', err)
    }
  })
  </script>
  