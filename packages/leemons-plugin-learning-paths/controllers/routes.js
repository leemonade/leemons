const {
  permissions: { permissionNames },
} = require('../config/constants');

const { getPermissionsForRoutes } = global.utils;

module.exports = [
  /*
    --- Tags ---
  */
  ...leemons.getPlugin('common').services.tags.getRoutes('tags', {
    authenticated: true,
    allowedPermissions: getPermissionsForRoutes(permissionNames.modules, ['create', 'update']),
  }),

  /*
    --- Modules ---
  */
  {
    method: 'POST',
    path: '/modules',
    handler: 'modules.create',
    authenticated: true,
    allowedPermissions: getPermissionsForRoutes(permissionNames.modules, ['create']),
  },
  {
    method: 'PUT',
    path: '/modules/:id',
    handler: 'modules.update',
    authenticated: true,
    allowedPermissions: getPermissionsForRoutes(permissionNames.modules, ['update']),
  },
  {
    method: 'POST',
    path: '/modules/:id/duplicate',
    handler: 'modules.duplicate',
    authenticated: true,
    allowedPermissions: getPermissionsForRoutes(permissionNames.modules, ['create']),
  },
  {
    method: 'DELETE',
    path: '/modules/:id',
    handler: 'modules.remove',
    authenticated: true,
    allowedPermissions: getPermissionsForRoutes(permissionNames.modules, ['delete']),
  },
  {
    method: 'POST',
    path: '/modules/:id/publish',
    handler: 'modules.publish',
    authenticated: true,
    allowedPermissions: getPermissionsForRoutes(permissionNames.modules, ['update']),
  },
  {
    method: 'POST',
    path: '/modules/:id/assign',
    handler: 'modules.assign',
    authenticated: true,
    allowedPermissions: getPermissionsForRoutes(permissionNames.modules, ['assign']),
  },
];
