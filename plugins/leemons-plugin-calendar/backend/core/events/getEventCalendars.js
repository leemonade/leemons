const _ = require('lodash');

const { detail: detailCalendar } = require('../calendar/detail');

async function getEventCalendars({ eventId, ctx }) {
  const eventCalendars = await ctx.tx.db.EventCalendar.find({ event: eventId }).lean();

  return Promise.all(
    _.map(eventCalendars, ({ calendar }) => detailCalendar({ id: calendar, ctx }))
  );
}

module.exports = { getEventCalendars };
