/**
 *
 * @param {Date} start
 * @param {Date} end
 * @returns string
 */

function calculeStatusFromDates(start, end) {
  const now = new Date();
  // Si la fecha actual es mayor que la fecha fin el "evento" ya ha pasado asi que estado finalizado.
  if (now > end) {
    return 'completed';
  }
  // Si la fecha actual es menor que la fecha de inicio del "evento" es que esta "programado" para empezar en un futuro.
  if (now < start) {
    return 'programmed';
  }
  // Si la fecha actual no esta ni por debajo de la fecha inicio ni por encima de la fin, es que esta en medio, justo esta ocurriendo el "evento"
  return 'published';
}

module.exports = { calculeStatusFromDates };
