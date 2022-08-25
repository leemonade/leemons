module.exports = [
  {
    path: '/install',
    method: 'POST',
    handler: 'pluginManager.install',
    authenticated: true,
    allowedPermissions: {
      'plugins.package-manager.plugins': {
        actions: ['create', 'admin'],
      },
    },
  },
  {
    path: '/remove',
    method: 'POST',
    handler: 'pluginManager.remove',
    authenticated: true,
    allowedPermissions: {
      'plugins.package-manager.plugins': {
        actions: ['delete', 'admin'],
      },
    },
  },
  {
    path: '/info',
    method: 'POST',
    handler: 'pluginManager.info',
    authenticated: true,
    /*
    allowedPermissions: {
      'plugins.package-manager.plugins': {
        actions: ['view', 'admin'],
      },
    },
     */
  },
];
