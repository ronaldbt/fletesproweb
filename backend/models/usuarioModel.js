// backend/models/usuarioModel.js

const db = require('../utils/db');
const bcrypt = require('bcryptjs');

// Buscar usuario por teléfono o email
async function buscarUsuarioPorCampo(campo, valor) {
  const [rows] = await db.execute(`SELECT * FROM usuarios WHERE ${campo} = ? LIMIT 1`, [valor]);
  return rows[0] || null;
}

// Crear nuevo usuario (cliente o conductor)
async function crearUsuario({ nombre, telefono, email, password, tipo }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');

  await db.execute(
    `INSERT INTO usuarios (nombre, telefono, email, password, tipo, creado_en)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [nombre, telefono, email, hashedPassword, tipo || 'cliente', fecha]
  );
}

// Verificar contraseña
async function verificarPassword(passwordIngresado, passwordHasheado) {
  return await bcrypt.compare(passwordIngresado, passwordHasheado);
}

module.exports = {
  buscarUsuarioPorCampo,
  crearUsuario,
  verificarPassword
};
