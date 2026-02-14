// src/utils/validator.js
export function validarRut(rut) {
  // 1. Limpiar el RUT de puntos y guiones, y pasarlo a mayúsculas
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  
  // Validar formato básico (mínimo 7 dígitos + DV)
  if (rutLimpio.length < 8) return false;

  // 2. Separar cuerpo y dígito verificador
  const cuerpo = rutLimpio.slice(0, -1);
  const dvRecibido = rutLimpio.slice(-1);

  // 3. Calcular el dígito verificador esperado
  let suma = 0;
  let multiplicador = 2;

  // Recorrer el cuerpo de derecha a izquierda
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const dvEsperado = 11 - (suma % 11);
  
  // 4. Convertir el resultado a formato de dígito verificador (0-9 o K)
  let dvCalculado;
  if (dvEsperado === 11) dvCalculado = '0';
  else if (dvEsperado === 10) dvCalculado = 'K';
  else dvCalculado = dvEsperado.toString();

  // 5. Comparar el DV calculado con el recibido
  return dvCalculado === dvRecibido;
}
