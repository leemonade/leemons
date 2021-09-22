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

  // ES: Cogemos todos los permisos del usuario
  // EN: We take all the user permissions
  const userPermissions = await leemons
    .getPlugin('users')
    .services.permissions.getUserAgentPermissions(userSession.userAgents, {
      transacting,
    });

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
  const items = await leemons.getPlugin('users').services.permissions.findItems(
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

  _.forEach(items, (item) => {
    if (item.type === permissionConfig.type) {
      calendarIds.push();
    } else {
    }
  });

  console.log(items);
}

module.exports = { getCalendarsToFrontend };
