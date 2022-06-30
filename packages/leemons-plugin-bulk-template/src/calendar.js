/* eslint-disable no-await-in-loop */
const { keys, isEmpty } = require('lodash');
const importEvents = require('./bulk/calendar');

async function initCalendar({ users, programs }) {
  const { services } = leemons.getPlugin('calendar');

  try {
    const events = await importEvents({ programs, users });
    const eventKeys = keys(events);

    // console.dir(events, { depth: null });

    for (let i = 0, len = eventKeys.length; i < len; i++) {
      const key = eventKeys[i];

      if (key && !isEmpty(key)) {
        const { creator, calendar, ...event } = events[key];

        if (creator && !isEmpty(creator)) {
          try {
            if (calendar.indexOf('.') > -1) {
              const eventData = await services.calendar.addEvent(calendar, event, {
                userSession: users[creator],
              });
              events[key] = { ...eventData };
            }
          } catch (e) {
            console.log('-- ERROR Creating event calendar --');
            console.error(e);
          }
        }
      }
    }

    return events;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initCalendar;
