module.exports = [
  {
    path: '/get-schema',
    method: 'POST',
    handler: 'dataset.getSchema',
    authenticated: true,
    allowedPermissions: {
      'plugins.dataset.dataset': {
        actions: ['view', 'update', 'create', 'delete', 'admin'],
      },
    },
  },
  {
    path: '/get-schema-locale',
    method: 'POST',
    handler: 'dataset.getSchemaLocale',
    authenticated: true,
    allowedPermissions: {
      'plugins.dataset.dataset': {
        actions: ['view', 'update', 'create', 'delete', 'admin'],
      },
    },
  },
  {
    path: '/get-schema-field-locale',
    method: 'POST',
    handler: 'dataset.getSchemaFieldLocale',
    authenticated: true,
    allowedPermissions: {
      'plugins.dataset.dataset': {
        actions: ['view', 'update', 'create', 'delete', 'admin'],
      },
    },
  },
  {
    path: '/save-field',
    method: 'POST',
    handler: 'dataset.saveField',
    authenticated: true,
    allowedPermissions: {
      'plugins.dataset.dataset': {
        actions: ['update', 'create', 'admin'],
      },
    },
  },
  {
    path: '/save-multiple-fields',
    method: 'POST',
    handler: 'dataset.saveMultipleFields',
    authenticated: true,
    allowedPermissions: {
      'plugins.dataset.dataset': {
        actions: ['update', 'create', 'admin'],
      },
    },
  },
  {
    path: '/remove-field',
    method: 'POST',
    handler: 'dataset.removeField',
    authenticated: true,
    allowedPermissions: {
      'plugins.dataset.dataset': {
        actions: ['delete', 'admin'],
      },
    },
  },
];
