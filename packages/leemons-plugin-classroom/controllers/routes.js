const { defaultPermissions } = require('../config/constants');

const defaultPermission = {
  [defaultPermissions[0].permissionName]: {
    actions: defaultPermissions[0].actions,
  },
};

module.exports = [
  {
    path: '/tree/detail',
    method: 'GET',
    handler: 'tree.detail',
    authenticated: true,
    allowedPermissions: { ...defaultPermission },
  },
];
