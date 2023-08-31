const {
  permissions: { names: permissions },
} = require('../config/constants');

const getPermissions = (permissionsArr, actions = null) => {
  if (Array.isArray(permissionsArr)) {
    return permissionsArr.reduce(
      (obj, [permission, _actions]) => ({
        ...obj,
        [permission]: {
          actions: _actions.includes('admin') ? _actions : ['admin', ..._actions],
        },
      }),
      {}
    );
  }
  return {
    [permissionsArr]: {
      actions: actions.includes('admin') ? actions : ['admin', ...actions],
    },
  };
};

module.exports = [
  // Tags
  ...leemons.getPlugin('common').services.tags.getRoutes('tags', {
    authenticated: true,
    allowedPermissions: {
      [permissions.creator]: {
        actions: ['update', 'create', 'delete', 'admin'],
      },
    },
  }),

  // Packages
  {
    path: '/package',
    method: 'POST',
    handler: 'package.savePackage',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.creator, ['create', 'update']),
  },
  {
    path: '/package/duplicate',
    method: 'POST',
    handler: 'package.duplicatePackage',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.creator, ['create', 'update']),
  },
  {
    path: '/package/assign',
    method: 'POST',
    handler: 'package.assignPackage',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.creator, ['create', 'update']),
  },
  {
    path: '/package/share',
    method: 'POST',
    handler: 'package.sharePackage',
    authenticated: true,
  },
  {
    path: '/package/supported-versions',
    method: 'GET',
    handler: 'package.getSupportedVersions',
  },
  {
    path: '/package/:id',
    method: 'GET',
    handler: 'package.getPackage',
    authenticated: true,
  },
  {
    path: '/package/:id',
    method: 'DELETE',
    handler: 'package.deletePackage',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.creator, ['delete']),
  },

  // Assignation
  {
    path: '/status/:instance/:user',
    method: 'PUT',
    handler: 'status.updateStatus',
    authenticated: true,
  },
  {
    path: '/assignation/:instance/:user',
    method: 'GET',
    handler: 'status.getScormAssignation',
    authenticated: true,
  },
  {
    path: '/public/:filePath(.*)',
    method: 'GET',
    handler: 'public.serveFile',
    authenticated: false,
  },
];
