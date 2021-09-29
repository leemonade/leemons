const _ = require('lodash');
const { table } = require('../tables');

/**
 * Add nexts notifications to event
 * @public
 * @static
 * @param {string} eventId - EventId
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function addNexts(eventId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      // TODO Calcular y añadir notificaciones del evento del calendario
    },
    table.calendars,
    _transacting
  );
}

module.exports = { addNexts };
