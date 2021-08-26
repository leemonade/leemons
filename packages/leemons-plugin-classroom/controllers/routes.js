const { defaultPermissions } = require('../config/constants');

const defaultPermission = (actions) => {
  return {
    [defaultPermissions[0].permissionName]: {
      actions: actions || defaultPermissions[0].actions,
    },
  };
};

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
];
