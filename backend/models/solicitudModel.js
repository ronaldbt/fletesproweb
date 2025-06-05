// backend/models/solicitudModel.js
const db = require('../utils/db'); // conexión a mysql2

function generarId() {
  return 'F' + Math.floor(100000 + Math.random() * 900000);
}

function crearSolicitud({ nombre, telefono, email, origen, destino, precio, carga, ayudante }) {
  const id = generarId();

  return {
    id,
    nombre,
    telefono,
    email,
    origen,
    destino,
    precio,
    carga,
    ayudante,
    fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
    asignado: false
  };
}

async function guardarSolicitud(solicitud) {
  const sql = `
    INSERT INTO reservas 
      (id, nombre, telefono, email, origen, destino, precio, carga, ayudante, fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    solicitud.id,
    solicitud.nombre,
    solicitud.telefono,
    solicitud.email,
    solicitud.origen,
    solicitud.destino,
    solicitud.precio,
    solicitud.carga,
    solicitud.ayudante,
    solicitud.fecha
  ];

  await db.execute(sql, values);
  return solicitud.id;
}

module.exports = {
  crearSolicitud,
  guardarSolicitud
};
