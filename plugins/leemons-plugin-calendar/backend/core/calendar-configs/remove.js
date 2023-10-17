const _ = require('lodash');

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
async function remove({ id, ctx }) {
  await validateNotExistCalendarConfig({ id, ctx });
  const configCalendars = getCalendars({ id, ctx });
  await ctx.tx.db.CalendarConfigCalendars.deleteMany({ config: id });
  await Promise.all(_.map(configCalendars, (calendar) => removeCalendar({ id: calendar.id, ctx })));
  await removeByConfigId({ configId: id, ctx });
  await ctx.tx.db.CalendarConfigs.deleteOne({ id });
  return true;
}

module.exports = { remove };
