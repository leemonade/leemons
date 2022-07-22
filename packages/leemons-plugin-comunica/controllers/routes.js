module.exports = [
  {
    path: '/room/:key/messages',
    method: 'GET',
    handler: 'room.getMessages',
    authenticated: true,
  },
];
