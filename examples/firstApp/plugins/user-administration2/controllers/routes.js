module.exports = [
  {
    path: '/users2',
    method: 'POST',
    handler: 'users.register',
  },
  {
    path: '/reload',
    method: 'ALL',
    handler: 'users.reload',
  },
];
