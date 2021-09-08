const { defaultPermissions } = require('../config/constants');

const defaultPermission = (actions) => ({
  [defaultPermissions[0].permissionName]: {
    actions: actions || defaultPermissions[0].actions,
  },
});

module.exports = [
  {
    path: '/settings',
    method: 'GET',
    handler: 'settings.findOne',
    authenticated: true,
    allowedPermissions: { ...defaultPermission(['view']) },
  },
  {
    path: '/settings',
    method: 'POST',
    handler: 'settings.update',
    authenticated: true,
    allowedPermissions: { ...defaultPermission(['edit', 'admin']) },
  },
  {
    path: '/settings/enable-menu-item',
    method: 'POST',
    handler: 'settings.enableMenuItem',
    authenticated: true,
    allowedPermissions: { ...defaultPermission(['edit', 'admin']) },
  },
  {
    path: '/tree/detail',
    method: 'GET',
    handler: 'tree.detail',
    authenticated: true,
    allowedPermissions: { ...defaultPermission(['view']) },
  },

  // TODO: Add permissions
  {
    path: '/levelSchema',
    method: 'POST',
    handler: 'levelSchemas.add',
    authenticated: false,
  },
  {
    path: '/levelSchema/:id',
    method: 'GET',
    handler: 'levelSchemas.get',
    authenticated: false,
  },
  {
    path: '/levelSchema',
    method: 'GET',
    handler: 'levelSchemas.list',
    authenticated: false,
  },
  {
    path: '/levelSchema/:id',
    method: 'DELETE',
    handler: 'levelSchemas.delete',
    authenticated: false,
  },
  {
    path: '/levelSchema/:id',
    method: 'PATCH',
    handler: 'levelSchemas.update',
    authenticated: false,
  },
  {
    path: '/levelSchema/:id/names',
    method: 'PATCH',
    handler: 'levelSchemas.setNames',
    authenticated: false,
  },
  {
    path: '/levelSchema/:id/parent',
    method: 'PATCH',
    handler: 'levelSchemas.setParent',
    authenticated: false,
  },
  {
    path: '/levelSchema/:id/isClass',
    method: 'PATCH',
    handler: 'levelSchemas.setIsClass',
    authenticated: false,
  },
  {
    path: '/levelSchema/:id/assignables',
    method: 'POST',
    handler: 'levelSchemas.addAssignables',
    authenticated: false,
  },
  {
    path: '/levelSchema/:id/assignables',
    method: 'DELETE',
    handler: 'levelSchemas.removeAssignables',
    authenticated: false,
  },

  {
    path: '/level',
    method: 'POST',
    handler: 'levels.add',
    authenticated: false,
  },
  {
    path: '/level/:id',
    method: 'GET',
    handler: 'levels.get',
    authenticated: false,
  },
  {
    path: '/level',
    method: 'GET',
    handler: 'levels.list',
    authenticated: false,
  },
  {
    path: '/level/:id',
    method: 'DELETE',
    handler: 'levels.delete',
    authenticated: false,
  },
  {
    path: '/level/:id',
    method: 'PATCH',
    handler: 'levels.update',
    authenticated: false,
  },
  {
    path: '/level/:id/names',
    method: 'PATCH',
    handler: 'levels.setNames',
    authenticated: false,
  },
  {
    path: '/level/:id/descriptions',
    method: 'PATCH',
    handler: 'levels.setDescriptions',
    authenticated: false,
  },
  {
    path: '/level/:id/parent',
    method: 'PATCH',
    handler: 'levels.setParent',
    authenticated: false,
  },
  {
    path: '/level/:id/users',
    method: 'GET',
    handler: 'levels.getUsers',
    authenticated: false,
  },
  {
    path: '/level/:id/users',
    method: 'POST',
    handler: 'levels.addUsers',
    authenticated: false,
  },
  {
    path: '/level/:id/users',
    method: 'DELETE',
    handler: 'levels.removeUsers',
    authenticated: false,
  },
];
