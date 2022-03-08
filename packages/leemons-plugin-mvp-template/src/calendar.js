const { map } = require('lodash');

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
    title: 'Test event',
    startDate: startDate1.toISOString(),
    endDate: endDate1.toISOString(),
    isAllDay: true,
    // repeat: null,
    type: 'plugins.calendar.event',
  },
  {
    title: 'Leemons task',
    startDate: startDate2.toISOString(),
    endDate: endDate2.toISOString(),
    isAllDay: false,
    // repeat: null,
    type: 'plugins.calendar.task',
  },
];

async function addCalendarAndEventAsClassroom(users) {
  const { studentA01 } = users;
  const calendarKey = leemons.plugin.prefixPN('calendar-test');
  const calendarKey2 = leemons.plugin.prefixPN('calendar-test2');
  const section = leemons.plugin.prefixPN('Testing');

  const { services } = leemons.getPlugin('calendar');

  await services.calendar.add(calendarKey, {
    name: 'Biology',
    bgColor: '#aaff96',
    borderColor: '#aaff96',
    section,
  });

  await services.calendar.add(calendarKey2, {
    name: 'Math',
    bgColor: '#ffe796',
    borderColor: '#ffe796',
    section,
    icon: '/public/assets/svgs/family.svg',
  });

  await Promise.all(map(events, (event) => services.calendar.addEvent(calendarKey, event)));

  await services.calendar.grantAccessUserAgentToCalendar(
    calendarKey,
    studentA01.userAgents[0].id,
    'view'
  );
  await services.calendar.grantAccessUserAgentToCalendar(
    calendarKey2,
    studentA01.userAgents[0].id,
    'view'
  );
}

module.exports = addCalendarAndEventAsClassroom;
