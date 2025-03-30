// backend/controllers/reservasController.js

const validator = require('validator')
const { enviarSolicitudAConductores } = require('../chatbots/conductorBot')
const { enviarConfirmacionCliente } = require('../services/emailService')
const db = require('../utils/db')

const crearReserva = async (req, res) => {
  const client = req.whatsapp // ✅ cliente WhatsApp desde middleware
  const { nombre, telefono, email, origen, destino, precio } = req.body

  // 🔒 Validaciones básicas
  if (!nombre || !telefono || !origen || !destino || !precio) {
    console.warn('⚠️ Solicitud incompleta recibida:', req.body)
    return res.status(400).json({ error: 'Faltan datos obligatorios en la reserva.' })
  }

  // 📞 Validación de teléfono
  if (!validator.isMobilePhone(telefono, 'any')) {
    console.warn('📵 Teléfono inválido:', telefono)
    return res.status(400).json({ error: 'Número de teléfono inválido.' })
  }

  // 📧 Validación de email si lo proporciona
  if (email && !validator.isEmail(email)) {
    console.warn('📧 Email inválido:', email)
    return res.status(400).json({ error: 'Correo electrónico inválido.' })
  }

  const nuevaSolicitud = {
    id: `f${Date.now()}`,
    nombre,
    telefono,
    email,
    origen,
    destino,
    precio,
    fecha: new Date().toISOString().slice(0, 19).replace('T', ' ') // formato MySQL DATETIME
  }

  try {
    // 🟢 Log de control
    console.log('📦 Procesando nueva reserva:', nuevaSolicitud)

    // 💬 WhatsApp a conductores
    enviarSolicitudAConductores(nuevaSolicitud, client)
    console.log('📤 WhatsApp enviado a conductores.')

    // 📧 Email al cliente
    if (email) {
      await enviarConfirmacionCliente(nuevaSolicitud)
      console.log('📧 Email de confirmación enviado al cliente.')
    }

    // 💾 Guardar en MySQL
    const sql = `INSERT INTO reservas (id, nombre, telefono, email, origen, destino, precio, fecha)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

    const values = [
      nuevaSolicitud.id,
      nuevaSolicitud.nombre,
      nuevaSolicitud.telefono,
      nuevaSolicitud.email,
      nuevaSolicitud.origen,
      nuevaSolicitud.destino,
      nuevaSolicitud.precio,
      nuevaSolicitud.fecha
    ]

    await db.execute(sql, values)
    console.log('💾 Reserva guardada en MySQL.')

    return res.status(200).json({
      mensaje: 'Solicitud enviada y registrada correctamente.',
      fleteId: nuevaSolicitud.id
    })

  } catch (error) {
    console.error('❌ Error al procesar reserva:', error)
    return res.status(500).json({ error: 'Ocurrió un error al procesar la reserva.' })
  }
}

module.exports = { crearReserva }
