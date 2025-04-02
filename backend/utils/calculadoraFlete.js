function calcularPrecio(distanciaKm, conAyudante = false) {
    let precio = 0;
  
    if (distanciaKm <= 100) {
      precio = 15000 + distanciaKm * 1300;
    } else {
      precio = distanciaKm * 900;
    }
  
    if (conAyudante) {
      precio += 10000;
    }
  
    return Math.round(precio);
  }
  
  module.exports = { calcularPrecio };
  