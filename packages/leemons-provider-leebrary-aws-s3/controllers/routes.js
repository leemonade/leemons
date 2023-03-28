module.exports = [
  {
    path: '/config',
    method: 'GET',
    handler: 'config.getConfig',
    authenticated: true,
  },
  {
    path: '/config',
    method: 'DELETE',
    handler: 'config.deleteConfig',
    authenticated: true,
  },
  {
    path: '/config',
    method: 'POST',
    handler: 'config.setConfig',
    authenticated: true,
  },
];
