// backend/models/solicitudModel.js

function crearSolicitud({ nombre, telefono, email, origen, destino, precio }) {
  // Generamos un ID único legible con prefijo 'F' y 6 dígitos aleatorios
  const id = 'F' + Math.floor(100000 + Math.random() * 900000);

  // Creamos el objeto de la solicitud con todos los campos necesarios
  return {
    id,
    nombre,
    telefono,
    email,
    origen,
    destino,
    precio,
    fecha: new Date().toISOString().slice(0, 19).replace('T', ' '), // formato DATETIME MySQL
    asignado: false // será útil más adelante para saber si el flete fue tomado
  };
}

module.exports = { crearSolicitud };
