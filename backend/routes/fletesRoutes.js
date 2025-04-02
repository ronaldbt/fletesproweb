const express = require('express')
const router = express.Router()
const db = require('../utils/db')

// 📦 Obtener pedidos del cliente
router.get('/cliente/:telefono', async (req, res) => {
  const telefono = req.params.telefono
  try {
    const [rows] = await db.execute(
      `SELECT * FROM reservas WHERE telefono = ? ORDER BY fecha DESC`,
      [telefono]
    )
    res.json(rows)
  } catch (error) {
    console.error('❌ Error al obtener pedidos cliente:', error)
    res.status(500).json({ error: 'Error al obtener pedidos' })
  }
})

// 🚚 Obtener fletes realizados por el conductor
router.get('/conductor/:numero', async (req, res) => {
  const numero = req.params.numero
  try {
    const [rows] = await db.execute(
      `SELECT * FROM reservas WHERE conductor_asignado = ? ORDER BY fecha DESC`,
      [numero]
    )
    res.json(rows)
  } catch (error) {
    console.error('❌ Error al obtener fletes del conductor:', error)
    res.status(500).json({ error: 'Error al obtener fletes' })
  }
})

module.exports = router
