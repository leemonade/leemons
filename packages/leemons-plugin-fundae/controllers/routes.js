const {
  permissions: { names: permissions },
} = require('../config/constants');

module.exports = [
  {
    path: '/report/add',
    method: 'POST',
    handler: 'report.generate',
    authenticated: true,
    allowedPermissions: {
      [permissions.fundae]: {
        actions: ['create', 'admin'],
      },
    },
  },
  {
    path: '/report/list',
    method: 'GET',
    handler: 'report.list',
    authenticated: true,
    allowedPermissions: {
      [permissions.fundae]: {
        actions: ['view', 'admin'],
      },
    },
  },
];
