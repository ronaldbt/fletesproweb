// backend/routes/reservasRoutes.js

const express = require('express')
const router = express.Router()
const { recibirNotificaciones } = require('../controllers/paymentsController');

// Ruta POST para crear una reserva de flete
router.post('/notificaciones', recibirNotificaciones)

module.exports = router
