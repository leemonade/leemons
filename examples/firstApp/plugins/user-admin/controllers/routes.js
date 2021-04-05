module.exports = [
  {
    path: '/user',
    method: 'POST',
    handler: 'users.register',
  },
  {
    path: '/user/:id',
    method: 'GET',
    handler: 'users.publicInfo',
  },
  {
    path: '/users',
    method: 'GET',
    handler: 'users.allUsers',
  },
  {
    path: '/login',
    method: 'POST',
    handler: 'users.login',
  },
];
