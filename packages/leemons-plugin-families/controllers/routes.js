module.exports = [
  /**
   * User agents
   * */
  {
    path: '/search-users',
    method: 'POST',
    handler: 'families.searchUsers',
    authenticated: true,
    allowedPermissions: {
      'plugins.families.families': {
        actions: ['update', 'create', 'admin'],
      },
    },
  },
  /**
   * Dataset
   * */
  {
    path: '/dataset-form',
    method: 'GET',
    handler: 'families.getDatasetForm',
    authenticated: true,
    allowedPermissions: {
      'plugins.families.families': {
        actions: ['view', 'update', 'create', 'admin'],
      },
    },
  },
];
