<template>
    <div class="flete-container">
      <h1 class="title">Calculadora precio flete Región Metropolitana</h1>
      <div ref="map" class="map"></div>
  
      <form @submit.prevent="calcularRuta" class="flete-form">
        <label for="origen">Origen:</label>
        <input id="origen" type="text" v-model="origen" />
  
        <label for="destino">Destino:</label>
        <input id="destino" type="text" v-model="destino" />
  
        <div class="resultado" v-if="distancia && precio">
          Distancia: {{ distancia.toFixed(2) }} km<br />
          Precio: ${{ precio.toFixed(0) }} CLP
        </div>
  
        <button type="submit">Mostrar Precio Flete</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const origen = ref('')
  const destino = ref('')
  const distancia = ref(null)
  const precio = ref(null)
  const map = ref(null)
  
  let directionsService
  let directionsRenderer
  
  onMounted(() => {
  const apiKey = encodeURIComponent(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)

  // ✅ Si ya está cargado Google Maps (por alguna navegación en SPA)
  if (window.google && window.google.maps) {
    initMap()
    return
  }

  // ✅ Evitar cargar el script dos veces si ya se insertó
  if (document.getElementById('google-maps-script')) {
    return
  }

  const googleScript = document.createElement('script')
  googleScript.id = 'google-maps-script'
  googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
  googleScript.async = true
  googleScript.defer = true

  // ✅ Lógica cuando carga bien
  googleScript.onload = () => {
    console.log('✅ Google Maps API cargada correctamente')
    initMap()
  }

  // ✅ Lógica si falla
  googleScript.onerror = () => {
    console.error('❌ Error al cargar Google Maps API. Verifica tu API key, conexión o restricciones en Google Cloud Console.')
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
  
    new google.maps.places.Autocomplete(document.getElementById('origen'), {
      bounds: chileBounds,
      strictBounds: true
    })
    new google.maps.places.Autocomplete(document.getElementById('destino'), {
      bounds: chileBounds,
      strictBounds: true
    })
  }
  
  function calcularRuta() {
    if (!origen.value || !destino.value) {
      alert('Por favor, complete ambos campos.')
      return
    }
  
    const request = {
      origin: origen.value,
      destination: destino.value,
      travelMode: 'DRIVING'
    }
  
    directionsService.route(request, (result, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(result)
        const distKm = result.routes[0].legs[0].distance.value / 1000
        distancia.value = distKm
        precio.value = 15000 + distKm * 1300
      } else {
        alert('No fue posible calcular la ruta.')
      }
    })
  }
  </script>
  
  <style scoped>
  .flete-container {
    width: 100%;
    max-width: 900px;
    margin: auto;
    padding: 1rem;
    text-align: center;
  }
  
  .title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .map {
    width: 100%;
    height: 350px;
    margin-bottom: 1rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .flete-form {
    background: #f4f4f4;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  label {
    display: block;
    margin: 0.5rem 0 0.2rem;
    font-weight: bold;
  }
  
  input {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
  }
  
  button {
    background-color: #3498db;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #2980b9;
  }
  
  .resultado {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #e0e0e0;
    border-radius: 5px;
    font-size: 18px;
  }
  </style>
  