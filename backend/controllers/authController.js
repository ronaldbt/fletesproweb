// backend/controllers/authController.js

const bcrypt = require('bcrypt');
const validator = require('validator');
const db = require('../utils/db');
const {
  buscarUsuarioPorCampo,
  crearUsuario,
  verificarPassword
} = require('../models/usuarioModel');

// Registro de usuarios (cliente o conductor)
async function registrar(req, res) {
  try {
    const { nombre, email, telefono, password, tipo } = req.body;

    if (!nombre || !password || (!email && !telefono)) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (telefono && !validator.isMobilePhone(telefono, 'any')) {
      return res.status(400).json({ error: 'Teléfono inválido' });
    }

    // Verificar que el usuario no exista
    if (email) {
      const existente = await buscarUsuarioPorCampo('email', email);
      if (existente) return res.status(409).json({ error: 'Ya existe un usuario con este email' });
    }

    if (telefono) {
      const existente = await buscarUsuarioPorCampo('telefono', telefono);
      if (existente) return res.status(409).json({ error: 'Ya existe un usuario con este teléfono' });
    }

    await crearUsuario({ nombre, email, telefono, password, tipo });

    res.status(201).json({ mensaje: 'Registro exitoso' });
  } catch (err) {
    console.error('❌ Error en registro:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

// Login de usuarios
async function login(req, res) {
  try {
    const { email, telefono, password } = req.body;

    if (!password || (!email && !telefono)) {
      return res.status(400).json({ error: 'Credenciales incompletas' });
    }

    const campo = email ? 'email' : 'telefono';
    const valor = email || telefono;

    const usuario = await buscarUsuarioPorCampo(campo, valor);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const esValido = await verificarPassword(password, usuario.password);
    if (!esValido) return res.status(403).json({ error: 'Contraseña incorrecta' });

    res.json({
      mensaje: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        tipo: usuario.tipo,
        telefono: usuario.telefono,
        email: usuario.email
      }
    });
  } catch (err) {
    console.error('❌ Error en login:', err);
    res.status(500).json({ error: 'Error en login' });
  }
}

module.exports = { registrar, login };
