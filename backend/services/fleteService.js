const axios = require('axios');
const { calcularPrecio } = require('../utils/calculadoraFlete');
require('dotenv').config(); // Para acceder a GOOGLE_MAPS_API_KEY

async function calcularPrecioDesdeGoogle(origen, destino, conAyudante = false) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    throw new Error('❌ No se encontró GOOGLE_MAPS_API_KEY en el entorno');
  }

  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origen)}&destinations=${encodeURIComponent(destino)}&key=${apiKey}`;

  try {
    const res = await axios.get(url);

    if (
      res.data.status !== 'OK' ||
      !res.data.rows[0] ||
      !res.data.rows[0].elements[0] ||
      res.data.rows[0].elements[0].status !== 'OK'
    ) {
      throw new Error('❌ Error en la respuesta de Google Maps Distance Matrix');
    }

    const datos = res.data.rows[0].elements[0];
    const distanciaKm = datos.distance.value / 1000;
    const precio = calcularPrecio(distanciaKm, conAyudante);

    return { distanciaKm, precio };
  } catch (err) {
    console.error('❌ Error en calcularPrecioDesdeGoogle:', err.message);
    throw err;
  }
}

module.exports = { calcularPrecioDesdeGoogle };
