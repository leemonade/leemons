const _ = require('lodash');

/**
 * Add nexts notifications to event
 * @public
 * @static
 * @param {string} eventId - EventId
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addNexts({ eventId, ctx }) {
  // TODO Calcular y añadir notificaciones del evento del calendario
}

module.exports = { addNexts };
