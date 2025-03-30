// backend/index.js

// Importaciones principales
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cors = require('cors');
require('dotenv').config();

// Importaciones de bots
const manejarMensajeCliente = require('./chatbots/clienteBot');
const { manejarRespuestaConductor } = require('./chatbots/conductorBot');

// Inicializar servidor Express
const app = express();
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('🚀 Backend FletesPro funcionando en Express');
});

// Inicializar WhatsApp Web con sesión persistente
const client = new Client({
  authStrategy: new LocalAuth(), // Guarda sesión en /.wwebjs_auth
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

// Mostrar QR en consola para vincular sesión
client.on('qr', (qr) => {
  console.log('📲 Escanea este QR con WhatsApp:');
  qrcode.generate(qr, { small: true });
});

// Confirmar conexión
client.on('ready', () => {
  console.log('✅ WhatsApp conectado y listo');
});

// Detectar mensajes entrantes
client.on('message', async (message) => {
  if (!message.fromMe) {
    // Manejar chatbot para clientes (origen/destino)
    manejarMensajeCliente(message, client);

    // Manejar respuestas de conductores (Sí + ID)
    manejarRespuestaConductor(message, client);
  }
});

// Iniciar cliente WhatsApp
client.initialize();

// Iniciar servidor Express
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🌐 Servidor Express activo en http://localhost:${PORT}`);
});
