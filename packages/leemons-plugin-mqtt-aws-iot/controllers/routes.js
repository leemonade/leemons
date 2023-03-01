module.exports = [
  {
    method: 'GET',
    path: '/credentials',
    handler: 'socket.getCredentials',
    authenticated: true,
  },
  {
    method: 'POST',
    path: '/config',
    handler: 'socket.setConfig',
    authenticated: true,
    allowedPermissions: {
      'plugins.mqtt-aws-iot.config': {
        actions: ['admin'],
      },
    },
  },
  {
    method: 'GET',
    path: '/config',
    handler: 'socket.getConfig',
    authenticated: true,
    allowedPermissions: {
      'plugins.mqtt-aws-iot.config': {
        actions: ['admin'],
      },
    },
  },
];
