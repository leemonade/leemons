/**
 * Return permissions config for the calendar with key provided
 * @public
 * @static
 * @param {string?} key - key
 * @return {{type: string, typeEvent: string, permissionName: string, permissionNameEvents: string, all: AddItemPermission,  allEvent:AddItemPermission}}
 * */
function getPermissionConfig(key) {
  const permissionName = `plugins.calendar.calendar.${key}`;
  const permissionNameEvents = `plugins.calendar.calendar.events.${key}`;
  return {
    type: 'plugins.calendar.calendar',
    typeEvent: 'plugins.calendar.calendar.events',
    permissionName,
    permissionNameEvents,
    all: {
      permissionName,
      actionNames: ['view', 'delete', 'admin', 'owner'],
    },
    allEvent: {
      permissionName: permissionNameEvents,
      actionNames: ['view', 'create', 'update', 'delete', 'admin', 'owner'],
    },
  };
}

module.exports = { getPermissionConfig };
