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
    path: '/report/retry',
    method: 'POST',
    handler: 'report.retry',
    authenticated: true,
    allowedPermissions: {
      [permissions.fundae]: {
        actions: ['create', 'admin'],
      },
    },
  },
  {
    path: '/report/list',
    method: 'POST',
    handler: 'report.list',
    authenticated: true,
    allowedPermissions: {
      [permissions.fundae]: {
        actions: ['view', 'admin'],
      },
    },
  },
];
