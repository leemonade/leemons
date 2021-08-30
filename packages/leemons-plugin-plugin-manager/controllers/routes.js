module.exports = [
  {
    path: '/install',
    method: 'POST',
    handler: 'pluginManager.install',
    authenticated: true,
    allowedPermissions: {
      'plugins.plugin-manager.plugins': {
        actions: ['create', 'admin'],
      },
    },
  },
];
