module.exports = [
  {
    path: '/config',
    method: 'GET',
    handler: 'config.getConfig',
    authenticated: true,
  },
];
