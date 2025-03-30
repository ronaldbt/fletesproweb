// backend/chatbots/conductorBot.js

const fs = require('fs');
const path = require('path');
const conductores = require('../data/conductores.json'); // Lista de conductores registrados
const emailService = require('../services/emailService');

// Lista temporal de solicitudes activas
const solicitudesPendientes = new Map();

function enviarSolicitudAConductores(flete, client) {
  const fleteId = `f${Date.now()}`; // ID único

  solicitudesPendientes.set(fleteId, {
    ...flete,
    asignado: false
  });

  const mensaje = `🚛 *Nueva solicitud de flete disponible*\n\n📍 Origen: ${flete.origen}\n📦 Destino: ${flete.destino}\n\nResponde con *Sí ${fleteId}* para aceptarlo.`;

  conductores.forEach(conductor => {
    client.sendMessage(conductor.numero, mensaje);
  });
}

// Escucha mensajes para ver si un conductor acepta el flete
function manejarRespuestaConductor(message, client) {
  const texto = message.body.trim().toLowerCase();
  const partes = texto.split(' ');

  if (partes.length === 2 && partes[0] === 'sí') {
    const fleteId = partes[1];
    const flete = solicitudesPendientes.get(fleteId);

    if (flete && !flete.asignado) {
      flete.asignado = true;
      solicitudesPendientes.set(fleteId, flete);

      // Notificar al conductor
      client.sendMessage(message.from, `✅ Flete confirmado. Cliente: ${flete.numero}\n📍 Origen: ${flete.origen}\n📦 Destino: ${flete.destino}`);

      // Notificar al cliente por correo
      emailService.enviarConfirmacionCliente(flete);

      // Avisar a otros conductores que ya fue tomado
      conductores.forEach(conductor => {
        if (conductor.numero !== message.from) {
          client.sendMessage(conductor.numero, `❌ El flete ${fleteId} ya fue tomado por otro conductor.`);
        }
      });
    }
  }
}

module.exports = {
  enviarSolicitudAConductores,
  manejarRespuestaConductor
};
