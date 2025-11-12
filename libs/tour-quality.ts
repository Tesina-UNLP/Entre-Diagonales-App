/**
 * Calcula el porcentaje de calidad de un tour completado
 * basándose en los secretos y trivias completados
 *
 * @param secretsCompleted - Número de secretos descubiertos
 * @param triviasCompleted - Número de trivias respondidas correctamente
 * @param secretsTotal - Total de secretos disponibles en el tour
 * @param triviasTotal - Total de trivias disponibles en el tour
 * @returns Porcentaje de calidad (0-100)
 *
 * @example
 * // Si se descubrieron 3 de 4 secretos y se respondieron 2 de 5 trivias
 * const quality = calculateQualityPercentage(3, 2, 4, 5)
 * // Retorna: 40 (el mínimo entre 75% de secretos y 40% de trivias)
 */
export const calculateQualityPercentage = (
  secretsCompleted: number,
  triviasCompleted: number,
  secretsTotal: number,
  triviasTotal: number,
): number => {
  // Si no hay secretos o trivias, calculamos el porcentaje de forma segura
  // evitando división por cero
  const secretsPercentage =
    secretsTotal > 0 ? (secretsCompleted / secretsTotal) * 100 : 0;
  const triviasPercentage =
    triviasTotal > 0 ? (triviasCompleted / triviasTotal) * 100 : 0;

  // Si ambos son 0, retornamos 100 para dar al menos una estrella
  if (secretsTotal === 0 && triviasTotal === 0) {
    return 100;
  }

  // Si uno de los dos es 0, usamos solo el que tiene valor
  if (secretsTotal === 0) return triviasPercentage;
  if (triviasTotal === 0) return secretsPercentage;

  // Si ambos tienen valor, usamos el mínimo (el más bajo determina la calidad)
  return Math.min(secretsPercentage, triviasPercentage);
};

/**
 * Calcula el número de estrellas a mostrar basándose en el porcentaje de calidad
 *
 * @param qualityPercentage - Porcentaje de calidad (0-100)
 * @returns Número de estrellas (1-3)
 *
 * Rangos:
 * - 0-33%: 1 estrella
 * - 34-66%: 2 estrellas
 * - 67-100%: 3 estrellas
 *
 * @example
 * calculateStarsToShow(75) // Retorna: 3
 * calculateStarsToShow(50) // Retorna: 2
 * calculateStarsToShow(25) // Retorna: 1
 */
export const calculateStarsToShow = (qualityPercentage: number): number => {
  // Garantizamos al menos 1 estrella, máximo 3
  // 0-33% = 1 estrella, 34-66% = 2 estrellas, 67-100% = 3 estrellas
  return Math.max(1, Math.min(3, Math.ceil(qualityPercentage / 33.33)));
};
