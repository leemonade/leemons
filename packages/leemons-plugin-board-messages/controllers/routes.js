module.exports = [
  {
    path: '/list',
    method: 'GET',
    handler: 'messages.list',
    authenticated: true,
  },
];
