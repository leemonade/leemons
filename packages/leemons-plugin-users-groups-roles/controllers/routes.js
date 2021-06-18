module.exports = [
  {
    path: '/init',
    method: 'POST',
    handler: 'init.init',
  },
  // Users
  {
    path: '/user/login',
    method: 'POST',
    handler: 'users.login',
  },
  {
    path: '/user/recover',
    method: 'POST',
    handler: 'users.recover',
  },
  {
    path: '/user/reset',
    method: 'POST',
    handler: 'users.reset',
  },
  {
    path: '/user/can/reset',
    method: 'POST',
    handler: 'users.canReset',
  },
  {
    path: '/user',
    method: 'GET',
    handler: 'users.detail',
    authenticated: true,
  },
  {
    path: '/user/list',
    method: 'POST',
    handler: 'users.list',
    authenticated: true,
    allowedPermissions: {
      users: {
        actions: ['view', 'update', 'create', 'delete', 'admin'],
      },
    },
  },
  {
    path: '/user',
    method: 'POST',
    handler: 'users.create',
  },
  {
    path: '/super-admin',
    method: 'POST',
    handler: 'users.createSuperAdmin',
  },
  // Roles
  {
    path: '/role',
    method: 'GET',
    handler: 'roles.list',
  },
  {
    path: '/role',
    method: 'POST',
    handler: 'roles.create',
  },
  {
    path: '/role/:id',
    method: 'PUT',
    handler: 'roles.create',
  },
];
