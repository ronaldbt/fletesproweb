// backend/chatbots/conductorBot.js

const db = require('../utils/db');


const fs = require('fs');
const path = require('path');
const { enviarConfirmacionCliente } = require('../services/emailService');

// ✅ Leer y limpiar conductores
const rawData = fs.readFileSync(path.join(__dirname, '../data/conductores.json'));
let conductores = JSON.parse(rawData);

// 🧠 Asegurar que todos los números estén en formato correcto
conductores = conductores.map(c => {
  let numero = c.numero.toString().replace(/\s+/g, '');
  if (!numero.endsWith('@c.us')) {
    numero += '@c.us';
  }
  return { ...c, numero };
});

// 🧠 Lista temporal de solicitudes activas
const solicitudesPendientes = new Map();

/**
 * Enviar solicitud de flete a todos los conductores disponibles
 * @param {Object} flete - Datos del flete (origen, destino, cliente, etc.)
 * @param {Object} client - Cliente WhatsApp
 */
async function enviarSolicitudAConductores(flete, client) {
  if (!client || typeof client.sendMessage !== 'function') {
    console.error('❌ Error: cliente WhatsApp no válido en enviarSolicitudAConductores');
    return;
  }

  const fleteId = flete.id;
  solicitudesPendientes.set(fleteId, { ...flete, asignado: false });

  const pagoConductor = Math.round(Number(flete.precio || 0) * 0.9);
  const mensaje = `🚛 *Nueva solicitud de flete disponible*

🆔 ID del flete: ${fleteId}
📍 Origen: ${flete.origen}
📦 Destino: ${flete.destino}
📦 Carga: ${flete.carga}
👥 Ayudante: ${flete.ayudante ? 'Sí (+$10.000)' : 'No'}
💰 Pago: $${pagoConductor.toLocaleString()} CLP

✅ Responde con *Sí* para aceptarlo
❌ Responde con *No* para rechazarlo.`;



  for (const conductor of conductores) {
    try {
      const isRegistered = await client.isRegisteredUser(conductor.numero);
      if (isRegistered) {
        await client.sendMessage(conductor.numero, mensaje);
      } else {
        console.warn(`⚠️ El número ${conductor.numero} no está registrado en WhatsApp.`);
      }
    } catch (err) {
      console.error(`❌ Error al enviar mensaje a ${conductor.numero}:`, err);
    }
  }

  console.log(`📤 Solicitud enviada a ${conductores.length} conductores. ID: ${fleteId}`);
}

/**
 * Maneja las respuestas entrantes de los conductores (ej: "Sí f123456")
 * @param {Object} message - Mensaje recibido
 * @param {Object} client - Cliente WhatsApp
 */
async function manejarRespuestaConductor(message, client) {
  if (!client || typeof client.sendMessage !== 'function') {
    console.error('❌ Error: cliente WhatsApp no válido en manejarRespuestaConductor');
    return;
  }

  const texto = message.body.trim().toLowerCase();
  if (texto === 'no') {
    return client.sendMessage(message.from, '❌ Has rechazado el flete. Gracias por responder.');
  }
  
  const partes = texto.split(' ');

  if ((partes.length === 2 && partes[0] === 'si') || (partes.length === 1 && partes[0] === 'si')) {
    let fleteId = partes[1];
  
    // Si no viene el ID, buscar el flete asignado a este número
    if (!fleteId) {
      for (const [id, fleteData] of solicitudesPendientes.entries()) {
        if (!fleteData.asignado && fleteData && typeof fleteData === 'object') {
          fleteId = id;
          break;
        }
      }
    }
  
    const flete = solicitudesPendientes.get(fleteId);
  

    if (flete && !flete.asignado) {
      flete.asignado = true;
      solicitudesPendientes.set(fleteId, flete);

      try {
        await db.execute(
          'UPDATE reservas SET conductor_asignado = ? WHERE id = ?',
          [message.from, fleteId]
        );
        console.log(`📝 Conductor ${message.from} asignado en base de datos.`);
      } catch (err) {
        console.error('❌ Error al guardar conductor en MySQL:', err);
      }
      

      // ✅ Confirmar al conductor
      client.sendMessage(message.from, `✅ *Flete asignado a ti*

        🆔 ID: ${fleteId}
        👤 Cliente: ${flete.nombre}
        📞 Teléfono: ${flete.telefono}
        📍 Origen: ${flete.origen}
        📦 Destino: ${flete.destino}
        📦 Carga: ${flete.carga}
        👥 Ayudante: ${flete.ayudante ? 'Sí' : 'No'}
        💰 Tu pago: $${Math.round(Number(flete.precio || 0) * 0.9).toLocaleString()} CLP`)
        
        .catch(err => console.error('❌ Error al notificar conductor asignado:', err));

      // 📬 Notificar al cliente por correo
      if (flete.email) {
        enviarConfirmacionCliente(flete);
      }

      // ❌ Avisar a otros conductores
      conductores.forEach(conductor => {
        if (conductor.numero !== message.from) {
          client.sendMessage(conductor.numero, `❌ El flete *${fleteId}* ya fue asignado a otro conductor.`)
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
