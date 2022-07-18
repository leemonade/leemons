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
];
