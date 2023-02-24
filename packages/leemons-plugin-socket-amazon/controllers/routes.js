module.exports = [
  {
    method: 'GET',
    path: '/credentials',
    handler: 'socket.getCredentials',
    authenticated: true,
  },
];
