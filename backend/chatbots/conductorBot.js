// backend/chatbots/conductorBot.js

const conductores = require('../data/conductores.json'); // Lista de conductores registrados
const { enviarConfirmacionCliente } = require('../services/emailService');

// 🧠 Lista temporal de solicitudes activas
const solicitudesPendientes = new Map();

/**
 * Enviar solicitud de flete a todos los conductores disponibles
 * @param {Object} flete - Datos del flete (origen, destino, cliente, etc.)
 * @param {Object} client - Cliente WhatsApp
 */
function enviarSolicitudAConductores(flete, client) {
  if (!client || typeof client.sendMessage !== 'function') {
    console.error('❌ Error: cliente WhatsApp no válido en enviarSolicitudAConductores');
    return;
  }

  const fleteId = flete.id || `f${Date.now()}`;
  solicitudesPendientes.set(fleteId, { ...flete, asignado: false });

  const mensaje = `🚛 *Nueva solicitud de flete disponible*\n\n📍 Origen: ${flete.origen}\n📦 Destino: ${flete.destino}\n\nResponde con *Sí ${fleteId}* para aceptarlo.`;

  conductores.forEach(conductor => {
    if (conductor.numero) {
      client.sendMessage(conductor.numero, mensaje)
        .catch(err => console.error(`❌ Error al enviar mensaje a conductor ${conductor.numero}:`, err));
    }
  });

  console.log(`📤 Solicitud enviada a ${conductores.length} conductores. ID: ${fleteId}`);
}

/**
 * Maneja las respuestas entrantes de los conductores (ej: "Sí f123456")
 * @param {Object} message - Mensaje recibido
 * @param {Object} client - Cliente WhatsApp
 */
function manejarRespuestaConductor(message, client) {
  if (!client || typeof client.sendMessage !== 'function') {
    console.error('❌ Error: cliente WhatsApp no válido en manejarRespuestaConductor');
    return;
  }

  const texto = message.body.trim().toLowerCase();
  const partes = texto.split(' ');

  if (partes.length === 2 && partes[0] === 'sí') {
    const fleteId = partes[1];
    const flete = solicitudesPendientes.get(fleteId);

    if (flete && !flete.asignado) {
      flete.asignado = true;
      solicitudesPendientes.set(fleteId, flete);

      // ✅ Confirmar al conductor
      client.sendMessage(message.from, `✅ Flete confirmado.\n👤 Cliente: ${flete.nombre}\n📍 Origen: ${flete.origen}\n📦 Destino: ${flete.destino}`)
        .catch(err => console.error('❌ Error al notificar conductor asignado:', err));

      // 📬 Notificar al cliente por correo
      if (flete.email) {
        enviarConfirmacionCliente(flete);
      }

      // ❌ Avisar a los otros conductores
      conductores.forEach(conductor => {
        if (conductor.numero !== message.from) {
          client.sendMessage(conductor.numero, `❌ El flete ${fleteId} ya fue tomado por otro conductor.`)
            .catch(err => console.warn(`⚠️ No se pudo avisar a ${conductor.numero}:`, err));
        }
      });

      console.log(`✅ Flete ${fleteId} aceptado por ${message.from}`);
    }
  }
}

module.exports = {
  enviarSolicitudAConductores,
  manejarRespuestaConductor
};
