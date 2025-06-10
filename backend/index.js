// backend/index.js
require('dotenv').config();
// 📦 Dependencias principales
const express = require('express');
const cors = require('cors');

const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { esConductor } = require('./utils/identificarTipoUsuario');
const authRoutes = require('./routes/authRoutes');



// 📄 Cargar variables de entorno

// 🚀 Inicializar servidor Express
const app = express();
app.use(cors({
  origin: 'https://app.fletespro.cl', // ✅ solo tu frontend puede acceder
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // ✅ si usás cookies o auth headers
}));

app.options('*', cors()); // 🟢 responde a preflight OPTIONS
app.use(express.json());

// 🧠 Importaciones internas
const reservasRoutes = require('./routes/reservasRoutes');
const paymentsRoutes = require('./routes/paymentsRoutes');
const manejarMensajeCliente = require('./chatbots/clienteBot');
const { manejarRespuestaConductor } = require('./chatbots/conductorBot');

// 🤖 Inicializar cliente WhatsApp con sesión persistente
const client = new Client({
  authStrategy: new LocalAuth(), // Guarda sesión en /.wwebjs_auth
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

const fletesRoutes = require('./routes/fletesRoutes') // ⬅️ importar
app.use('/api/fletes', fletesRoutes) // ⬅️ usar la ruta
app.use('/api/payments', paymentsRoutes)

// 🛡 Middleware para inyectar el cliente WhatsApp en cada request
app.use((req, res, next) => {
  req.whatsapp = client;
  next();
});

// 🌐 Ruta base de prueba
app.get('/', (req, res) => {
  res.send('🚀 Backend FletesPro funcionando en Express');
});

// 📦 Rutas de la API
app.use('/api', reservasRoutes);
app.use('/api', authRoutes);


// 🔁 Conexión QR para iniciar sesión en WhatsApp
client.on('qr', (qr) => {
  console.log('📲 Escanea este QR con WhatsApp para vincular tu sesión:');
  qrcode.generate(qr, { small: true });
});

// ✅ Confirmación de conexión
client.on('ready', () => {
  console.log('✅ WhatsApp conectado y listo');
});

// 📩 Escuchar mensajes entrantes de clientes y conductores
client.on('message', async (message) => {
  if (message.fromMe) return;

  if (esConductor(message.from)) {
    manejarRespuestaConductor(message, client);
  } else {
    manejarMensajeCliente(message, client);
  }
});


// ▶️ Inicializar WhatsApp
client.initialize();

// 🚀 Iniciar servidor Express
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🌐 Servidor Express activo en http://localhost:${PORT}`);
});
