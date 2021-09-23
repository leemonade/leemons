const _ = require('lodash');
const { table } = require('../tables');
const { getPermissionConfig } = require('./getPermissionConfig');

/**
 * Add calendar with the provided key if not already exists
 * @public
 * @static
 * @param {any} userSession - key
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function getCalendarsToFrontend(userSession, { transacting } = {}) {
  const permissionConfig = getPermissionConfig();
  const userPlugin = leemons.getPlugin('users');

  // ES: Cogemos todos los permisos del usuario
  // EN: We take all the user permissions
  const userPermissions = await userPlugin.services.permissions.getUserAgentPermissions(
    userSession.userAgents,
    {
      transacting,
    }
  );

  const queryPermissions = [];

  // ES: Preparación de la consulta para comprobar los permisos
  // EN: Preparation of the query to check permissions
  if (userPermissions.length) {
    _.forEach(userPermissions, (userPermission) => {
      queryPermissions.push({
        permissionName: userPermission.permissionName,
        actionName_$in: userPermission.actionNames,
        target: userPermission.target,
      });
    });
  }

  // ES: Calendarios/Eventos a los que tiene acceso de lectura
  // EN: Calendars/Events with view access
  const items = await userPlugin.services.permissions.findItems(
    {
      $or: queryPermissions,
      type_$in: [permissionConfig.type, permissionConfig.typeEvent],
    },
    {
      transacting,
    }
  );

  const calendarIds = [];
  const eventIds = [];

  _.forEach(items, ({ item, type }) => {
    if (type === permissionConfig.type) {
      calendarIds.push(item);
    } else {
      eventIds.push(item);
    }
  });

  const [calendars, eventsFromCalendars, events] = await Promise.all([
    table.calendars.find(
      { id_$in: calendarIds },
      {
        transacting,
      }
    ),
    table.events.find(
      { calendar_$in: calendarIds },
      {
        transacting,
      }
    ),
    table.events.find(
      { id_$in: eventIds },
      {
        transacting,
      }
    ),
  ]);

  const userCalendar = _.find(calendars, {
    key: userPlugin.services.users.getUserAgentCalendarKey(userSession.userAgents[0].id),
  });

  if (userCalendar) {
    _.forEach(events, (event, index) => {
      events[index].calendar = userCalendar.id;
    });
  }

  return {
    userCalendar,
    calendars,
    events: events.concat(eventsFromCalendars),
  };
}

module.exports = { getCalendarsToFrontend };
