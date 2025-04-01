// backend/chatbots/clienteBot.js

const clientesEstado = new Map(); // Estado temporal por número
const solicitudes = []; // (Opcional) Lista local de solicitudes

/**
 * Maneja los mensajes entrantes de clientes por WhatsApp.
 * Usa pasos: 1 = origen, 2 = destino
 * @param {Object} message - Mensaje recibido de WhatsApp
 * @param {Object} client - Cliente de whatsapp-web.js
 */
function manejarMensajeCliente(message, client) {
  const numero = message.from;
  const texto = message.body.trim();

  if (!client || typeof client.sendMessage !== 'function') {
    console.error('❌ client WhatsApp no válido en manejarMensajeCliente');
    return;
  }

  // Iniciar conversación
  if (!clientesEstado.has(numero)) {
    clientesEstado.set(numero, { paso: 1 });
    client.sendMessage(
      numero,
      '¡Hola! 👋 Soy el asistente de *FletesPro*.\n\n¿Desde dónde necesitas que pase el flete?'
    );
    console.log(`📥 Nuevo cliente inició conversación: ${numero}`);
    return;
  }

  const estado = clientesEstado.get(numero);

  if (estado.paso === 1) {
    // Validar dirección origen
    if (texto.length < 3) {
      return client.sendMessage(numero, '❗ Por favor ingresa una dirección válida de origen.');
    }

    estado.origen = texto;
    estado.paso = 2;
    client.sendMessage(numero, '¿Y hacia dónde se dirige el flete?');
    console.log(`📍 Origen recibido de ${numero}: ${estado.origen}`);
  } else if (estado.paso === 2) {
    // Validar dirección destino
    if (texto.length < 3) {
      return client.sendMessage(numero, '❗ Por favor ingresa una dirección válida de destino.');
    }

    estado.destino = texto;

    // Guardar solicitud local (opcional)
    const nuevaSolicitud = {
      numero,
      origen: estado.origen,
      destino: estado.destino,
      fecha: new Date().toISOString()
    };
    solicitudes.push(nuevaSolicitud);

    // Confirmar al cliente
    client.sendMessage(
      numero,
      `✅ ¡Gracias! Tu solicitud ha sido registrada.\n\n📍 Origen: ${estado.origen}\n🚚 Destino: ${estado.destino}\n\nEn breve un conductor será asignado.`
    );

    console.log(`✅ Solicitud guardada para ${numero}:`, nuevaSolicitud);

    // 👉 Aquí puedes enviar a backend o guardar en base de datos si quieres

    // Reiniciar estado del cliente
    clientesEstado.delete(numero);
  }
}

module.exports = manejarMensajeCliente;
