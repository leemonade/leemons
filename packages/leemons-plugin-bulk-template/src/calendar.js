/* eslint-disable no-await-in-loop */
const { keys, isEmpty } = require('lodash');
const importEvents = require('./bulk/calendar');

async function initCalendar(file, { users, programs }) {
  const { services } = leemons.getPlugin('calendar');

  try {
    const events = await importEvents(file, { programs, users });
    const eventKeys = keys(events);
    const { chalk } = global.utils;

    // console.dir(events, { depth: null });

    for (let i = 0, len = eventKeys.length; i < len; i++) {
      const key = eventKeys[i];

      if (key && !isEmpty(key)) {
        const { creator, calendar, ...event } = events[key];

        if (creator && !isEmpty(creator)) {
          try {
            if (calendar.indexOf('.') < 0) {
              throw new Error('This event does not have any Calendar');
            }

            leemons.log.debug(chalk`{cyan.bold BULK} {gray Adding calendar event: ${event.title}}`);
            const eventData = await services.calendar.addEventFromUser(users[creator], {
              ...event,
              calendar,
            });
            events[key] = { ...eventData };
            leemons.log.info(chalk`{cyan.bold BULK} Calendar event ADDED: ${event.title}`);
          } catch (e) {
            console.log('-- ERROR Creating event calendar --');
            console.log(`event: ${event.title}`);
            console.log(`calendar: ${calendar}`);
            console.log(`creator: ${creator.name}`);
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
