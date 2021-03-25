module.exports = [
  {
    path: '/users',
    method: 'POST',
    handler: 'users.register',
  },
  {
    path: '/reload',
    method: 'ALL',
    handler: 'users.reload',
  },
];
