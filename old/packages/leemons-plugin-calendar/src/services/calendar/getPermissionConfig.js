/**
 * Return permissions config for the calendar with key provided
 * @public
 * @static
 * @param {string?} key - key
 * @return {{type: string, permissionName: string, all: AddItemPermission}}
 * */
function getPermissionConfig(key) {
  const permissionName = `plugins.calendar.calendar.${key}`;
  return {
    type: 'plugins.calendar.calendar',
    permissionName,
    all: {
      permissionName,
      actionNames: ['view', 'delete', 'admin', 'owner'],
    },
  };
}

module.exports = { getPermissionConfig };
