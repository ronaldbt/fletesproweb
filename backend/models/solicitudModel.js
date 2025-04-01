// backend/models/solicitudModel.js

function crearSolicitud({ nombre, telefono, email, origen, destino, precio }) {
    return {
      id: `f${Date.now()}`,
      nombre,
      telefono,
      email,
      origen,
      destino,
      precio,
      fecha: new Date().toISOString(),
      asignado: false
    }
  }
  
  module.exports = { crearSolicitud }
  