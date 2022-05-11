const _ = require('lodash');
const { table } = require('../tables');

const { detail: detailCalendar } = require('../calendar/detail');
const { detail: detailEvent } = require('./detail');

async function addToCalendar(_eventIds, _calendarIds, { transacting: _transacting } = {}) {
  const eventIds = _.isArray(_eventIds) ? _eventIds : [_eventIds];
  const calendarIds = _.isArray(_calendarIds) ? _calendarIds : [_calendarIds];

  return global.utils.withTransaction(
    async (transacting) => {
      const calendars = await Promise.all(
        _.map(calendarIds, (calendarId) => detailCalendar(calendarId, { transacting }))
      );

      const events = await Promise.all(
        _.map(eventIds, (eventId) => detailEvent(eventId, { transacting }))
      );

      const promises = [];

      _.forEach(calendars, (calendar) => {
        _.forEach(events, (event) => {
          promises.push(
            table.eventCalendar.create(
              {
                event: event.id,
                calendar: calendar.id,
              },
              { transacting }
            )
          );
        });
      });

      return Promise.all(promises);
    },
    table.calendars,
    _transacting
  );
}

module.exports = { addToCalendar };
