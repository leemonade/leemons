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
    path: '/tree/detail',
    method: 'GET',
    handler: 'tree.detail',
    authenticated: true,
    allowedPermissions: { ...defaultPermission() },
  },
  {
    path: '/settings',
    method: 'GET',
    handler: 'settings.findOne',
    authenticated: true,
    allowedPermissions: { ...defaultPermission() },
  },
  {
    path: '/settings',
    method: 'POST',
    handler: 'settings.update',
    authenticated: true,
    allowedPermissions: { ...defaultPermission(['admin']) },
  },
];
