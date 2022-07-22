module.exports = [
  {
    path: '/room/:key/messages',
    method: 'GET',
    handler: 'room.getMessages',
    authenticated: true,
  },
  {
    path: '/room/:key/messages',
    method: 'POST',
    handler: 'room.sendMessage',
    authenticated: true,
  },
  {
    path: '/room/:key',
    method: 'GET',
    handler: 'room.getRoom',
    authenticated: true,
  },
];
