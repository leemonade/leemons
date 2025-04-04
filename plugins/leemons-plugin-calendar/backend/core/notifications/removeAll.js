const _ = require("lodash");

/**
 * Remove all notifications for event
 * @public
 * @static
 * @param {string} eventId - EventId
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeAll({ eventId, ctx }) {
  // TODO Calcular y añadir notificaciones del evento del calendario
}

module.exports = { removeAll };
