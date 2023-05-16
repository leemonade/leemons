const _ = require('lodash');
const { table } = require('../tables');

/**
 * Remove all notifications for event
 * @public
 * @static
 * @param {string} eventId - EventId
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function removeAll(eventId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      // TODO Calcular y añadir notificaciones del evento del calendario
    },
    table.calendars,
    _transacting
  );
}

module.exports = { removeAll };
