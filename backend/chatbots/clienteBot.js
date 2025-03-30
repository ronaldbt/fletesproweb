// backend/chatbots/clienteBot.js

const clientesEstado = new Map(); // Guarda el estado por número de teléfono
const solicitudes = []; // Donde se guardan las solicitudes de flete

function manejarMensajeCliente(message, client) {
  const numero = message.from;
  const texto = message.body.trim().toLowerCase();

  if (!clientesEstado.has(numero)) {
    clientesEstado.set(numero, { paso: 1 });
    return client.sendMessage(numero, '¡Hola! 👋 Soy el asistente de FletesPro.\n¿Desde dónde necesitas que pase el flete?');
  }

  const estado = clientesEstado.get(numero);

  if (estado.paso === 1) {
    estado.origen = message.body.trim();
    estado.paso = 2;
    client.sendMessage(numero, '¿Y hacia dónde se dirige el flete?');
  } else if (estado.paso === 2) {
    estado.destino = message.body.trim();
    estado.paso = 3;

    // Guardar solicitud
    solicitudes.push({
      numero,
      origen: estado.origen,
      destino: estado.destino,
      fecha: new Date().toISOString()
    });

    client.sendMessage(numero, `✅ ¡Gracias! Tu solicitud ha sido registrada.\n📍 Origen: ${estado.origen}\n🚚 Destino: ${estado.destino}\nEn breve un conductor será asignado.`);

    // Podrías notificar a los conductores desde aquí

    // Reiniciar estado del cliente
    clientesEstado.delete(numero);
  }
}

module.exports = manejarMensajeCliente;
