const { table } = require('../tables');
const { validateNotExistCalendar } = require('../../validations/exists');

/**
 * Remove calendar if exists
 * @public
 * @static
 * @param {string} id - id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function remove(id, { _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistCalendar(id);
      // TODO: Borrar todos los permisos relacionados con los eventos/calendarios
      await table.events.deleteMany({ calendar: id }, { transacting });
      await table.calendars.delete({ id }, { transacting });
      return true;
    },
    table.calendars,
    _transacting
  );
}

module.exports = { remove };
