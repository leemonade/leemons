module.exports = [
  {
    path: '/user',
    method: 'POST',
    handler: 'users.add',
    authenticated: true,
    allowedPermissions: {
      'plugins.users.users': {
        actions: ['admin'],
      },
      'plugins.academic-portfolio.portfolio': {
        actions: ['admin'],
      },
    },
  },
  {
    path: '/load-stress-data',
    method: 'POST',
    handler: 'stress.load',
    authenticated: true,
    allowedPermissions: {
      'plugins.users.users': {
        actions: ['admin'],
      },
    },
  },
  {
    path: '/load-from-file',
    method: 'POST',
    handler: 'bulk.load',
  },
  {
    path: '/load-from-file',
    method: 'GET',
    handler: 'bulk.status',
  },
  {
    path: '/init-super',
    method: 'GET',
    handler: 'users.initSuper',
  },
];
