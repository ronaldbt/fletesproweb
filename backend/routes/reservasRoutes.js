// backend/routes/reservasRoutes.js

const express = require('express')
const router = express.Router()
const { crearReserva } = require('../controllers/reservasController')

// Ruta POST para crear una reserva de flete
router.post('/reservar', crearReserva)

module.exports = router
