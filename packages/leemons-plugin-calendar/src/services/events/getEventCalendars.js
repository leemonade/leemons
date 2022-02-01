const _ = require('lodash');
const { table } = require('../tables');

const { detail: detailCalendar } = require('../calendar/detail');

async function getEventCalendars(eventId, { transacting: _transacting } = {}) {
  return global.utils.withTransaction(
    async (transacting) => {
      const eventCalendars = await table.eventCalendar.find({ event: eventId }, { transacting });

      return Promise.all(
        _.map(eventCalendars, ({ calendar }) => detailCalendar(calendar, { transacting }))
      );
    },
    table.calendars,
    _transacting
  );
}

module.exports = { getEventCalendars };
