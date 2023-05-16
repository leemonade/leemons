const _ = require('lodash');
const { table } = require('../tables');

const { detail: detailCalendar } = require('../calendar/detail');

async function getEventCalendars(eventId, { transacting } = {}) {
  const eventCalendars = await table.eventCalendar.find({ event: eventId }, { transacting });

  return Promise.all(
    _.map(eventCalendars, ({ calendar }) => detailCalendar(calendar, { transacting }))
  );
}

module.exports = { getEventCalendars };
