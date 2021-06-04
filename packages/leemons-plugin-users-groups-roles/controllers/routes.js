module.exports = [
  {
    path: '/init',
    method: 'POST',
    handler: 'init.init',
  },
  // Users
  {
    path: '/user',
    method: 'POST',
    handler: 'users.create',
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
