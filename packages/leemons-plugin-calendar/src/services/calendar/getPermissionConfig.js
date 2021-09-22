/**
 * Return permissions config for the calendar with key provided
 * @public
 * @static
 * @param {string?} key - key
 * @return {{type: string, typeEvent: string, view:AddItemPermission, delete: AddItemPermission, all: AddItemPermission, createEvent:AddItemPermission, updateEvent:AddItemPermission, deleteEvent:AddItemPermission, allEvent:AddItemPermission}}
 * */
function getPermissionConfig(key) {
  const permissionName = `plugins.calendar.calendar.${key}`;
  const permissionNameEvents = `plugins.calendar.calendar.events.${key}`;
  return {
    type: 'plugins.calendar.calendar',
    typeEvent: 'plugins.calendar.calendar.events',
    view: {
      permissionName,
      actionNames: ['view', 'admin', 'owner'],
    },
    delete: {
      permissionName,
      actionNames: ['delete', 'admin', 'owner'],
    },
    all: {
      permissionName,
      actionNames: ['view', 'delete', 'admin', 'owner'],
    },
    viewEvent: {
      permissionName: permissionNameEvents,
      actionNames: ['view', 'admin', 'owner'],
    },
    createEvent: {
      permissionName: permissionNameEvents,
      actionNames: ['create', 'admin', 'owner'],
    },
    updateEvent: {
      permissionName: permissionNameEvents,
      actionNames: ['update', 'admin', 'owner'],
    },
    deleteEvent: {
      permissionName: permissionNameEvents,
      actionNames: ['delete', 'admin', 'owner'],
    },
    allEvent: {
      permissionName: permissionNameEvents,
      actionNames: ['view', 'create', 'update', 'delete', 'admin', 'owner'],
    },
  };
}

module.exports = { getPermissionConfig };
