module.exports = [
  /**
   * Dataset
   * */
  {
    path: '/dataset-form',
    method: 'GET',
    handler: 'emergency-numbers.getDatasetForm',
    authenticated: true,
    allowedPermissions: {
      'families-emergency-numbers.families-emergency-numbers': {
        actions: ['view', 'update', 'create', 'admin'],
      },
    },
  },
];
