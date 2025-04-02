// backend/routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { registrar, login } = require('../controllers/authController');

// Registro de nuevos usuarios (clientes o conductores)
router.post('/register', registrar);

// Login (por teléfono o email)
router.post('/login', login);

module.exports = router;
