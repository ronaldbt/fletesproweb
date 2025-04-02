// backend/chatbots/clienteBot.js

const clientesEstado = new Map();
const { calcularPrecioDesdeGoogle } = require('../services/fleteService');
const { crearSolicitud } = require('../models/solicitudModel');
const { enviarSolicitudAConductores } = require('./conductorBot');
const db = require('../utils/db');

async function manejarMensajeCliente(message, client) {
  const numero = message.from;
  const texto = message.body.trim();

  if (!client || typeof client.sendMessage !== 'function') {
    console.error('❌ client WhatsApp no válido en manejarMensajeCliente');
    return;
  }

  if (!clientesEstado.has(numero)) {
    clientesEstado.set(numero, { paso: 1 });
    client.sendMessage(
      numero,
      `👋 ¡Hola! Somos *FletesPro*.

💬 Te puedo cotizar el flete en línea si me das:
1️⃣ La dirección de origen
2️⃣ La dirección de destino

📍 ¿Cuál es la dirección de origen?`
    );
    console.log(`📥 Nuevo cliente inició conversación: ${numero}`);
    return;
  }

  const estado = clientesEstado.get(numero);

  if (estado.paso === 1) {
    if (texto.length < 3) {
      return client.sendMessage(numero, '❗ Por favor ingresa una dirección válida de origen.');
    }
    estado.origen = texto;
    estado.paso = 2;
    client.sendMessage(numero, '📍 Gracias. ¿Y cuál es la dirección de destino?');
  }

  else if (estado.paso === 2) {
    if (texto.length < 3) {
      return client.sendMessage(numero, '❗ Por favor ingresa una dirección válida de destino.');
    }
    estado.destino = texto;
    estado.paso = 3;
    client.sendMessage(numero, '📦 ¿Qué necesitas trasladar? (ej. cajas, muebles, electrodomésticos...)');
  }

  else if (estado.paso === 3) {
    estado.carga = texto;
    estado.paso = 4;
    client.sendMessage(numero, '👥 ¿Necesitas ayudante? (Responde *si* o *no*)');
  }

  else if (estado.paso === 4) {
    estado.ayudante = texto.toLowerCase().includes('si');
    estado.paso = 5;
    client.sendMessage(numero, '📅 ¿Para cuándo necesitas el flete? (Ej: hoy, mañana, viernes 10...)');
  }

  else if (estado.paso === 5) {
    estado.fecha = texto;

    try {
      const { distanciaKm, precio } = await calcularPrecioDesdeGoogle(estado.origen, estado.destino, estado.ayudante);
      estado.precio = precio;
      estado.distancia = distanciaKm;
      estado.paso = 6;
      estado.confirmacionPendiente = true;

      const resumen = `✅ *Cotización preliminar:*

📍 Origen: ${estado.origen}
📦 Destino: ${estado.destino}
📏 Distancia: ${distanciaKm.toFixed(2)} km
📦 Carga: ${estado.carga}
👥 Ayudante: ${estado.ayudante ? 'Si (+$10.000)' : 'No'}
📅 Fecha: ${estado.fecha}
💰 *Precio estimado:* $${precio.toLocaleString()} CLP`;

      client.sendMessage(numero, resumen + '\n\n¿Deseas reservar este flete? (responde *si* para confirmar)');
    } catch (err) {
      client.sendMessage(numero, '❌ No pudimos calcular el precio exacto en este momento. Por favor intenta más tarde.');
      clientesEstado.delete(numero);
    }
  }

  else if (estado.paso === 6 && estado.confirmacionPendiente) {
    if (texto.toLowerCase() === 'si') {
      const nuevaSolicitud = crearSolicitud({
        nombre: 'Cliente WhatsApp',
        telefono: numero,
        email: '',
        origen: estado.origen,
        destino: estado.destino,
        precio: estado.precio
      });

      try {
        await db.execute(
          `INSERT INTO reservas (id, nombre, telefono, email, origen, destino, precio, fecha)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            nuevaSolicitud.id,
            nuevaSolicitud.nombre,
            nuevaSolicitud.telefono,
            nuevaSolicitud.email,
            nuevaSolicitud.origen,
            nuevaSolicitud.destino,
            nuevaSolicitud.precio,
            nuevaSolicitud.fecha
          ]
        );

        await enviarSolicitudAConductores(nuevaSolicitud, client);

        client.sendMessage(numero, `🚚 ¡Perfecto! Tu solicitud fue registrada con el ID *${nuevaSolicitud.id}*. En breve un conductor será asignado. ✅`);
        console.log(`✅ Cotización confirmada y guardada para ${numero}:`, nuevaSolicitud);
      } catch (error) {
        console.error('❌ Error al guardar flete desde clienteBot:', error);
        client.sendMessage(numero, '❌ Ocurrió un error al guardar tu solicitud. Intenta más tarde.');
      }

      clientesEstado.delete(numero);
    } else {
      client.sendMessage(numero, '❌ Cotización cancelada. Si necesitas otra, solo escribe de nuevo.');
      clientesEstado.delete(numero);
    }
  }
}

module.exports = manejarMensajeCliente;
