// backend/utils/db.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // pon tu contraseña si tiene (en XAMPP por defecto es vacío)
  database: 'fletespro'
});

module.exports = pool;
