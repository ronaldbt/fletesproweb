// backend/utils/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD, // pon tu contraseña si tiene (en XAMPP por defecto es vacío)
  database: process.env.DATABASE_NAME
});

module.exports = pool;
