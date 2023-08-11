const { permissionNames } = require('../config/constants');

module.exports = [
  /*
    --- Periods ---
  */
  {
    method: 'POST',
    path: '/periods',
    handler: 'periods.add',
    authenticated: true,
    allowedPermissions: {
      [permissionNames.periods]: {
        actions: ['create', 'admin'],
      },
    },
  },
  {
    method: 'GET',
    path: '/periods',
    handler: 'periods.list',
    authenticated: true,
    allowedPermissions: {
      [permissionNames.periods]: {
        actions: ['view', 'admin'],
      },
    },
  },
  {
    method: 'DELETE',
    path: '/periods/:id',
    handler: 'periods.remove',
    authenticated: true,
    allowedPermissions: {
      [permissionNames.periods]: {
        actions: ['delete', 'admin'],
      },
    },
  },

  /*
    --- Scores ---
   */
  {
    method: 'GET',
    path: '/scores',
    handler: 'scores.get',
    authenticated: true,
  },
  {
    method: 'PATCH',
    path: '/scores',
    handler: 'scores.set',
    authenticated: true,
  },
  {
    method: 'DELETE',
    path: '/scores',
    handler: 'scores.remove',
    authenticated: true,
  },
];
