/* eslint-disable no-await-in-loop */
const { map, keys, isEmpty } = require('lodash');
const importEvents = require('./bulk/calendar');

const startDate1 = new Date();
startDate1.setUTCHours(0, 0, 0, 0);
const endDate1 = new Date();
endDate1.setUTCHours(23, 59, 59, 0);

const startDate2 = new Date();
startDate2.setUTCHours(11, 0, 0, 0);
const endDate2 = new Date();
endDate2.setUTCHours(13, 0, 0, 0);

const EVENTS = [
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
  const { studentB01 } = users;
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

  await Promise.all(map(EVENTS, (event) => services.calendar.addEvent(calendarKey, event)));

  await services.calendar.grantAccessUserAgentToCalendar(
    calendarKey,
    studentB01.userAgents[0].id,
    'view'
  );
  await services.calendar.grantAccessUserAgentToCalendar(
    calendarKey2,
    studentB01.userAgents[0].id,
    'view'
  );
}

const MOCK_KANBAN_EVENT = {
  startDate: null,
  endDate: null,
  type: 'plugins.calendar.task',
  repeat: 'dont_repeat',
  isAllDay: false,
  calendar: 'plugins.users.calendar.agent.1da39b4f-9bad-4f97-90dd-314ec8baa519',
  data: {
    hideInCalendar: true,
    description: 'Toma descripción en Kanban',
    subtask: [
      { checked: false, title: 'Primera subtarea' },
      { checked: false, title: 'Otra subtarea' },
    ],
    column: '67c41e63-386d-440e-bcb9-7d13de446d52',
  },
  title: 'Toma nueva tarea',
};

const MOCK_CALENDAR_EVENT = {
  startDate: '2022-05-31T18:00:07.000Z',
  endDate: '2022-05-31T19:00:07.000Z',
  type: 'plugins.calendar.event',
  repeat: 'dont_repeat',
  isAllDay: false,
  data: { description: 'Toma descripción' },
  title: 'Toma evento sin repetición',
};

async function initCalendar({ users, programs }) {
  const { services } = leemons.getPlugin('calendar');

  try {
    const events = await importEvents({ programs, users });
    const eventKeys = keys(events);

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
            //
          }
        }
      }
    }

    /*
    console.log('------ EVENTS ------');
    console.dir(
      keys(events)
        .slice(-5)
        .map((key) => events[key]),
      { depth: null }
    );
    */

    return events;
  } catch (err) {
    console.error(err);
  }

  return null;
}

module.exports = initCalendar;
