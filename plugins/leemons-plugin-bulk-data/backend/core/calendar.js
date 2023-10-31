/* eslint-disable no-await-in-loop */
const chalk = require('chalk');
const { keys, isEmpty } = require('lodash');
const importEvents = require('./bulk/calendar');

async function initCalendar({ file, config: { users, programs }, ctx }) {
  try {
    const events = await importEvents({ filePath: file, config: { programs, users }, ctx });
    const eventKeys = keys(events);

    for (let i = 0, len = eventKeys.length; i < len; i++) {
      const key = eventKeys[i];

      if (key && !isEmpty(key)) {
        const { creator, calendar, ...event } = events[key];

        if (creator && !isEmpty(creator)) {
          try {
            if (calendar.indexOf('.') < 0) {
              throw new Error('This event does not have any Calendar');
            }

            ctx.logger.debug(chalk`{cyan.bold BULK} {gray Adding calendar event: ${event.title}}`);
            const eventData = await ctx.call(
              'calendar.calendar.addEventFromUser',
              {
                data: {
                  ...event,
                  calendar,
                },
              },
              { meta: { userSession: { ...users[creator] } } }
            );
            events[key] = { ...eventData };
            ctx.logger.info(chalk`{cyan.bold BULK} Calendar event ADDED: ${event.title}`);
          } catch (e) {
            ctx.logger.log('-- ERROR Creating event calendar --');
            ctx.logger.log(`event: ${event.title}`);
            ctx.logger.log(`calendar: ${calendar}`);
            ctx.logger.log(`creator: ${creator.name}`);
            ctx.logger.error(e);
          }
        }
      }
    }

    return events;
  } catch (err) {
    ctx.logger.error(err);
  }

  return null;
}

module.exports = initCalendar;
