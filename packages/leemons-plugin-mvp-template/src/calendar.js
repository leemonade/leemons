const _ = require('lodash');

const startDate1 = new Date();
startDate1.setUTCHours(0, 0, 0, 0);
const endDate1 = new Date();
endDate1.setUTCHours(23, 59, 59, 0);

const startDate2 = new Date();
startDate2.setUTCHours(11, 0, 0, 0);
const endDate2 = new Date();
endDate2.setUTCHours(13, 0, 0, 0);

const events = [
  {
    title: 'Evento de prueba',
    startDate: startDate1.toISOString(),
    endDate: endDate1.toISOString(),
    isAllDay: true,
    // repeat: null,
    type: 'plugins.calendar.event',
  },
  {
    title: 'Tarea Leemons',
    startDate: startDate2.toISOString(),
    endDate: endDate2.toISOString(),
    isAllDay: false,
    // repeat: null,
    type: 'plugins.calendar.task',
  },
];

async function addCalendarAndEventAsClassroom(users) {
  const calendarKey = leemons.plugin.prefixPN('calendar-test');
  const calendarKey2 = leemons.plugin.prefixPN('calendar-test2');
  const section = leemons.plugin.prefixPN('Testing');
  await leemons.getPlugin('calendar').services.calendar.add(calendarKey, {
    name: 'Biologia',
    bgColor: '#aaff96',
    borderColor: '#aaff96',
    section,
  });
  await leemons.getPlugin('calendar').services.calendar.add(calendarKey2, {
    name: 'Matessssss',
    bgColor: '#ffe796',
    borderColor: '#ffe796',
    section,
    icon: '/assets/svgs/family.svg',
  });
  await Promise.all(
    _.map(events, (event) =>
      leemons.getPlugin('calendar').services.calendar.addEvent(calendarKey, event)
    )
  );
  await leemons
    .getPlugin('calendar')
    .services.calendar.grantAccessUserAgentToCalendar(
      calendarKey,
      users[0].userAgents[0].id,
      'view'
    );
  await leemons
    .getPlugin('calendar')
    .services.calendar.grantAccessUserAgentToCalendar(
      calendarKey2,
      users[0].userAgents[0].id,
      'view'
    );
}

module.exports = addCalendarAndEventAsClassroom;
