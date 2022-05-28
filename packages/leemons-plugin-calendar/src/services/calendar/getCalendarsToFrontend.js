const _ = require('lodash');
const { table } = require('../tables');
const { getPermissionConfig: getPermissionConfigCalendar } = require('./getPermissionConfig');
const { getPermissionConfig: getPermissionConfigEvent } = require('../events/getPermissionConfig');
const { getByCenterId } = require('../calendar-configs');
const { getCalendars } = require('../calendar-configs/getCalendars');
const { getEvents } = require('./getEvents');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {any} userSession - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getCalendarsToFrontend(userSession, { transacting } = {}) {
  const permissionConfigCalendar = getPermissionConfigCalendar();
  const permissionConfigEvent = getPermissionConfigEvent();
  const userPlugin = leemons.getPlugin('users');

  // ES: Cogemos todos los permisos del usuario
  // EN: We take all the user permissions
  const [userPermissions, center] = await Promise.all([
    userPlugin.services.permissions.getUserAgentPermissions(userSession.userAgents, {
      transacting,
    }),
    userPlugin.services.users.getUserAgentCenter(userSession.userAgents[0], { transacting }),
  ]);

  const queryPermissions = [];
  const ownerPermissions = [];

  // ES: Preparación de la consulta para comprobar los permisos
  // EN: Preparation of the query to check permissions
  if (userPermissions.length) {
    _.forEach(userPermissions, (userPermission) => {
      queryPermissions.push({
        permissionName: userPermission.permissionName,
        actionName_$in: userPermission.actionNames,
        target: userPermission.target,
      });
      if (userPermission.actionNames.indexOf('owner') >= 0) {
        ownerPermissions.push({
          permissionName: userPermission.permissionName,
          actionName_$in: ['owner'],
          target: userPermission.target,
        });
      }
    });
  }

  // ES: Calendarios/Eventos a los que tiene acceso de lectura
  // EN: Calendars/Events with view access
  let promises = [
    userPlugin.services.permissions.findItems(
      {
        $or: queryPermissions,
        type_$in: [permissionConfigCalendar.type, permissionConfigEvent.type],
      },
      {
        transacting,
      }
    ),
    userPlugin.services.permissions.findItems(
      {
        $or: ownerPermissions,
        type_$in: [permissionConfigCalendar.type],
      },
      {
        transacting,
      }
    ),
  ];
  if (center) promises.push(getByCenterId(center.id, { transacting }));
  const [items, ownerItems, calendarConfig] = await Promise.all(promises);

  // ES: Separamos los calendarios de los eventos
  // EN: We separate the calendars from the events
  const calendarIds = [];
  const eventIds = [];
  _.forEach(items, ({ item, type }) => {
    if (type === permissionConfigCalendar.type) {
      calendarIds.push(item);
    } else {
      eventIds.push(item);
    }
  });

  promises = [
    table.calendars.find(
      { id_$in: calendarIds },
      {
        transacting,
      }
    ),
    await Promise.all(
      _.map(calendarIds, (calendarId) =>
        getEvents(calendarId, {
          getPrivates: false,
          transacting,
        })
      )
    ),
    table.events.find(
      { id_$in: eventIds },
      {
        transacting,
      }
    ),
    table.classCalendar.find({ calendar_$in: calendarIds }, { transacting }),
  ];

  if (calendarConfig)
    promises.push(
      getCalendars(calendarConfig.id, {
        withEvents: true,
        transacting,
      })
    );
  const [calendars, eventsCalendars, events, classCalendars, configCalendars] = await Promise.all(
    promises
  );

  const eventsFromCalendars = _.flatten(eventsCalendars);

  // ES: Buscamos si el user agent tiene calendario
  // EN: We check if the user agent has a calendar
  const userCalendar = _.find(calendars, {
    key: userPlugin.services.users.getUserAgentCalendarKey(userSession.userAgents[0].id),
  });
  if (userCalendar) {
    // ES: Si tiene calendario todos los eventos sueltos los asignamos a su calendario
    // EN: If you have a calendar, all single events are assigned to your calendar.
    _.forEach(events, (event, index) => {
      events[index].calendar = userCalendar.id;
    });
  }

  const ownerCalendarIds = _.map(ownerItems, 'item');
  const ownerCalendars = _.filter(
    calendars,
    (calendar) => ownerCalendarIds.indexOf(calendar.id) >= 0
  );

  const finalCalendarsIds = [];
  const finalCalendars = [];

  if (userCalendar) {
    finalCalendars.push(userCalendar);
    finalCalendarsIds.push(userCalendar.id);
  }

  _.forEach(ownerCalendars, (calendar) => {
    if (finalCalendarsIds.indexOf(calendar.id) < 0) {
      // eslint-disable-next-line no-param-reassign
      calendar.section = 'plugins.users.calendar.user_section';
      finalCalendars.push(calendar);
      finalCalendarsIds.push(calendar.id);
    }
  });

  _.forEach(calendars, (calendar) => {
    if (finalCalendarsIds.indexOf(calendar.id) < 0) {
      finalCalendars.push(calendar);
      finalCalendarsIds.push(calendar.id);
    }
  });

  let configCalendarEvents = [];
  if (_.isArray(configCalendars)) {
    _.forEach(configCalendars, (calendar) => {
      configCalendarEvents = configCalendarEvents.concat(calendar.events);
      // eslint-disable-next-line no-param-reassign
      delete calendar.events;
      // eslint-disable-next-line no-param-reassign
      calendar.section = 'plugins.users.calendar.user_section';
      finalCalendars.push(calendar);
    });
  }

  const classCalendarsIds = _.map(classCalendars, 'calendar');

  // console.log('EVENTS --------', events);
  // console.log('EVENTS CALENDARS --------', eventsFromCalendars);

  return {
    userCalendar,
    ownerCalendars: _.sortBy(ownerCalendars, ({ id }) => (id === userCalendar.id ? 0 : 1)),
    calendarConfig,
    configCalendars,
    calendars: _.sortBy(
      _.map(finalCalendars, (calendar) => ({
        ...calendar,
        isClass: classCalendarsIds.indexOf(calendar.id) >= 0,
      })),
      ({ id }) => (id === userCalendar.id ? 0 : 1)
    ),
    events: _.uniqBy(
      eventsFromCalendars
        .map((e) => ({
          ...e,
          fromCalendar: true,
        }))
        .concat(events)
        .concat(configCalendarEvents)
        .map((event) => ({
          ...event,
          data: _.isString(event.data) ? JSON.parse(event.data) : event.data,
        })),
      'id'
    ),
  };
}

module.exports = { getCalendarsToFrontend };
