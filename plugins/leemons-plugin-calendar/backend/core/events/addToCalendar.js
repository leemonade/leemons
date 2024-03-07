const _ = require('lodash');

const { detail: detailCalendar } = require('../calendar/detail');
const { detail: detailEvent } = require('./detail');

async function addToCalendar({ eventIds: _eventIds, calendarIds: _calendarIds, ctx }) {
  const eventIds = _.isArray(_eventIds) ? _eventIds : [_eventIds];
  const calendarIds = _.isArray(_calendarIds) ? _calendarIds : [_calendarIds];

  const calendars = await Promise.all(
    _.map(calendarIds, (calendarId) => detailCalendar({ id: calendarId, ctx }))
  );

  const events = await Promise.all(_.map(eventIds, (eventId) => detailEvent({ id: eventId, ctx })));

  const toAdd = [];
  _.forEach(calendars, (calendar) => {
    _.forEach(events, (event) => {
      toAdd.push({
        event: event.id,
        calendar: calendar.id,
      });
    });
  });

  const result = await ctx.tx.db.EventCalendar.insertMany(toAdd);
  return _.map(result, (r) => r.toObject());
}

module.exports = { addToCalendar };
