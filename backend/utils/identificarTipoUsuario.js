const fs = require('fs');
const path = require('path');

// Cargar la lista de conductores
const rawData = fs.readFileSync(path.join(__dirname, '../data/conductores.json'));
const conductores = JSON.parse(rawData);

// Retorna true si el número pertenece a un conductor
function esConductor(numero) {
  return conductores.some(c => {
    const n = c.numero.replace(/\s+/g, '');
    return numero === (n.endsWith('@c.us') ? n : n + '@c.us');
  });
}

module.exports = { esConductor };
