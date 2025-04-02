<template>
  <div class="max-w-3xl mx-auto p-4">
    <h1 class="text-2xl font-bold text-center mb-6">
      Calculadora precio flete Región Metropolitana
    </h1>

    <div ref="map" class="w-full h-[350px] rounded-lg shadow mb-6"></div>

    <form @submit.prevent="calcularRuta" class="bg-gray-100 p-6 rounded-lg shadow space-y-4">
      <div>
        <label for="origen" class="block font-semibold mb-1">Origen:</label>
        <input
          id="origen"
          type="text"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div>
        <label for="destino" class="block font-semibold mb-1">Destino:</label>
        <input
          id="destino"
          type="text"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div class="text-center">
        <button
          type="submit"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Mostrar Precio Flete
        </button>
      </div>

      <div
        class="bg-white p-4 rounded border border-gray-200 text-center text-lg mt-6"
        v-if="distancia && precio"
      >
        <p><strong>Dirección origen:</strong> {{ direccionOrigen }}</p>
        <p><strong>Dirección destino:</strong> {{ direccionDestino }}</p>
        <p><strong>Distancia:</strong> {{ distancia.toFixed(2) }} km</p>
        <p><strong>Precio:</strong> ${{ precio.toFixed(0) }} CLP</p>
      </div>

      <div class="text-center mt-4" v-if="distancia && precio && !mostrarFormulario">
        <button
          type="button"
          @click="mostrarFormulario = true"
          class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Reservar este flete
        </button>
      </div>

      <!-- Formulario de reserva -->
      <div v-if="mostrarFormulario" class="space-y-4 bg-white p-4 rounded border border-gray-200 mt-4">
        <p class="text-center font-semibold text-gray-700">
          Solo necesitamos tus datos para reservar:
        </p>

        <input
          v-model="nombre"
          type="text"
          placeholder="Tu nombre"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          v-model="telefono"
          type="tel"
          placeholder="Tu teléfono"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Tu email (opcional)"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="button"
          @click="enviarReserva"
          class="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Confirmar Reserva
        </button>
      </div>
    </form>
  </div>
</template>




<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const mostrarFormulario = ref(false)
const nombre = ref('')
const telefono = ref('')
const email = ref('')



const distancia = ref(null)
const precio = ref(null)
const direccionOrigen = ref('')
const direccionDestino = ref('')
const map = ref(null)

const origenPlace = ref(null)
const destinoPlace = ref(null)

let directionsService
let directionsRenderer

onMounted(() => {
  const apiKey = encodeURIComponent(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)

  if (window.google && window.google.maps) {
    initMap()
    return
  }

  if (document.getElementById('google-maps-script')) {
    return
  }

  const googleScript = document.createElement('script')
  googleScript.id = 'google-maps-script'
  googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
  googleScript.async = true
  googleScript.defer = true

  googleScript.onload = () => {
    console.log('✅ Google Maps API cargada correctamente')
    initMap()
  }

  googleScript.onerror = () => {
    console.error('❌ Error al cargar Google Maps API.')
  }

  document.head.appendChild(googleScript)
})

function initMap() {
  const chileBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-56.0, -75.0),
    new google.maps.LatLng(-17.5, -66.0)
  )

  const mapInstance = new google.maps.Map(map.value, {
    center: { lat: -33.45, lng: -70.645 },
    zoom: 10
  })

  directionsRenderer = new google.maps.DirectionsRenderer({ map: mapInstance })
  directionsService = new google.maps.DirectionsService()

  const inputOrigen = document.getElementById('origen')
  const inputDestino = document.getElementById('destino')

  const autocompleteOrigen = new google.maps.places.Autocomplete(inputOrigen, {
    bounds: chileBounds,
    strictBounds: true
  })

  const autocompleteDestino = new google.maps.places.Autocomplete(inputDestino, {
    bounds: chileBounds,
    strictBounds: true
  })

  autocompleteOrigen.addListener('place_changed', () => {
    origenPlace.value = autocompleteOrigen.getPlace()
  })

  autocompleteDestino.addListener('place_changed', () => {
    destinoPlace.value = autocompleteDestino.getPlace()
  })
}

function calcularRuta() {
  if (!origenPlace.value || !destinoPlace.value) {
    alert('Por favor, selecciona direcciones válidas desde las sugerencias.')
    return
  }

  const request = {
    origin: { placeId: origenPlace.value.place_id },
    destination: { placeId: destinoPlace.value.place_id },
    travelMode: 'DRIVING'
  }

  directionsService.route(request, (result, status) => {
    if (status === 'OK') {
      directionsRenderer.setDirections(result)

      const leg = result.routes[0].legs[0]
      distancia.value = leg.distance.value / 1000
      precio.value = 15000 + distancia.value * 1300
      direccionOrigen.value = leg.start_address
      direccionDestino.value = leg.end_address
    } else {
      alert('No fue posible calcular la ruta.')
    }
  })
}

async function enviarReserva() {
  if (!nombre.value || !telefono.value) {
    alert('Por favor, completa tu nombre y teléfono.')
    return
  }

  const body = {
    nombre: nombre.value,
    telefono: telefono.value,
    email: email.value,
    origen: direccionOrigen.value,
    destino: direccionDestino.value,
    precio: precio.value
  }

  try {
    const res = await fetch('http://localhost:3001/api/reservar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    console.log('✅ Reserva enviada:', data)

    // Guardar en localStorage para mostrar en GraciasView.vue
    localStorage.setItem('flete_nombre', nombre.value)
    localStorage.setItem('flete_destino', direccionDestino.value)
    localStorage.setItem('flete_email', email.value)
    localStorage.setItem('flete_id', data.fleteId)

    // Redirigir a GraciasView.vue
    router.push('/gracias')
  } catch (error) {
    console.error('❌ Error al enviar reserva:', error)
    alert('Hubo un error al procesar tu solicitud.')
  }
}


</script>

  
  <style scoped>
  </style>
  