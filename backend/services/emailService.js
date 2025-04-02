// backend/services/emailService.js

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // tu correo
    pass: process.env.EMAIL_PASS  // tu contraseña o app password
  }
});

async function enviarConfirmacionCliente(flete) {
  const correoDestino = flete.email || 'cliente@ejemplo.com'; // Deberías guardar el correo al inicio
  const mailOptions = {
    from: `"FletesPro" <${process.env.EMAIL_USER}>`,
    to: correoDestino,
    subject: 'Tu flete está en camino',
    text: `Hola 👋

Tu solicitud de flete fue confirmada.

📍 Origen: ${flete.origen}
📦 Destino: ${flete.destino}
📦 Carga: ${flete.carga}
👥 Ayudante: ${flete.ayudante ? 'Sí (+$10.000)' : 'No'}

Un conductor ya está en camino. ¡Gracias por usar FletesPro!`

  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('📧 Correo enviado al cliente');
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
  }
}

module.exports = {
  enviarConfirmacionCliente
};
