const _ = require('lodash');
const { table } = require('../tables');
const { detail: calendarDetail } = require('../calendar/detail');

/**
 *
 * @public
 * @static
 * @param {string} id
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function detail(id, { withCalendar, withEvents, transacting } = {}) {
  const classroomLevel = await table.classroomLevelCalendars.findOne({ id }, { transacting });
  let calendar = classroomLevel.calendar;
  if (withCalendar || withEvents) {
    calendar = await calendarDetail(calendar, { withEvents, transacting });
  }
  return {
    ...classroomLevel,
    calendar,
  };
}

module.exports = { detail };
