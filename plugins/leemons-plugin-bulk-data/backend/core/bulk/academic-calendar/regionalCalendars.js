const { keys, isNil, isEmpty } = require('lodash');
const itemsImport = require('../helpers/simpleListImport');

async function importRegionalCalendars(filePath, centers) {
  const calendarItems = await itemsImport(filePath, 'ac_regional_calendars', 40, true, true);
  const eventItems = await itemsImport(filePath, 'ac_reg_events', 40, true, true);

  keys(calendarItems).forEach((key) => {
    const centerKey = calendarItems[key].center;
    calendarItems[key].daysOffEvents = [];
    calendarItems[key].localEvents = [];
    calendarItems[key].regionalEvents = [];
    calendarItems[key].center = centers[centerKey]?.id;
  });

  keys(eventItems)
    .filter((key) => !isNil(key) && !isEmpty(key))
    .forEach((key) => {
      const event = eventItems[key];
      const calendar = calendarItems[event?.regionalCalendar];

      if (calendar) {
        if (event.type === 'regional' && !calendar.regionalCalendarRel) {
          calendar.regionalEvents.push(event);
        }
        if (event.type === 'local') {
          calendar.localEvents.push(event);
        }
        if (event.type === 'day-off') {
          calendar.daysOffEvents.push(event);
        }
      }

      delete event.type;
      delete event.center; // todo remove from excel generation, unnecesary
      delete event.creator; // todo remove from excel generation, unnecesary
      delete event.regionalCalendar;
    });
  return calendarItems;
}

module.exports = importRegionalCalendars;
