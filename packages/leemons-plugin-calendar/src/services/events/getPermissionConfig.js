/**
 * Return permissions config for the calendar with key provided
 * @public
 * @static
 * @param {string?} id - id
 * @return {{type: string, permissionName: string, all: AddItemPermission}}
 * */
function getPermissionConfig(id) {
  const permissionName = `plugins.calendar.calendar.event.${id}`;
  return {
    type: 'plugins.calendar.calendar.events',
    permissionName,
    all: {
      permissionName,
      actionNames: ['view', 'create', 'update', 'delete', 'admin', 'owner'],
    },
  };
}

module.exports = { getPermissionConfig };
