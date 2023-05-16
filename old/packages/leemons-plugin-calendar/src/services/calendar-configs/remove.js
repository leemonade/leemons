const _ = require('lodash');
const { table } = require('../tables');

const { validateNotExistCalendarConfig } = require('../../validations/exists');
const { removeByConfigId } = require('../center-calendar-configs');
const { remove: removeCalendar } = require('../calendar');
const { getCalendars } = require('./getCalendars');

/**
 * Delete calendar config
 * @public
 * @static
 * @param {any} id - Config id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function remove(id, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      await validateNotExistCalendarConfig(id, { transacting });
      const configCalendars = getCalendars(id, { transacting });
      await table.calendarConfigCalendars.deleteMany({ config: id }, { transacting });
      await Promise.all(
        _.map(configCalendars, (calendar) => {
          return removeCalendar(calendar.id);
        })
      );
      await removeByConfigId(id, { transacting });
      await table.calendarConfigs.delete({ id }, { transacting });
      return true;
    },
    table.calendars,
    _transacting
  );
}

module.exports = { remove };
