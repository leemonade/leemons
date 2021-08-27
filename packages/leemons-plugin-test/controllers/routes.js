module.exports = [
  /**
   * Test
   * */
  {
    path: '/test',
    method: 'POST',
    handler: 'test.test',
    allowedPermissions: {
      'plugins.test.test': {
        actions: ['view', 'update', 'create', 'delete', 'admin'],
      },
    },
  },
];
