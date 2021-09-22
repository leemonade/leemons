const _ = require('lodash');

const startDate = new Date();
startDate.setUTCHours(0, 0, 0, 0);
const endDate = new Date();
endDate.setUTCHours(23, 59, 59, 0);

const event = {
  title: 'Evento de prueba desde una supuesta clase',
  startDate: startDate.toISOString(),
  endDate: endDate.toISOString(),
  isAllDay: true,
  // repeat: null,
  type: 'plugins.calendar.event',
};

async function addCalendarAndEventAsClassroom(users) {
  const calendarKey = leemons.plugin.prefixPN('calendar-test');
  await leemons.getPlugin('calendar').services.calendar.add(calendarKey);
  await leemons.getPlugin('calendar').services.calendar.addEvent(calendarKey, event);
  await leemons
    .getPlugin('calendar')
    .services.calendar.grantAccessUserAgentToCalendar(
      calendarKey,
      users[0].userAgents[0].id,
      'view'
    );
}

module.exports = addCalendarAndEventAsClassroom;
