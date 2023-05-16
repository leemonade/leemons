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
  // Document
  {
    path: '/document',
    method: 'POST',
    handler: 'document.saveDocument',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.creator, ['create', 'update']),
  },
  {
    path: '/document/:id',
    method: 'GET',
    handler: 'document.getDocument',
    authenticated: true,
  },
  {
    path: '/document/:id',
    method: 'DELETE',
    handler: 'document.deleteDocument',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.creator, ['delete']),
  },
  {
    path: '/document/duplicate',
    method: 'POST',
    handler: 'document.duplicateDocument',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.creator, ['create', 'update']),
  },
  {
    path: '/document/assign',
    method: 'POST',
    handler: 'document.assignDocument',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.creator, ['create', 'update']),
  },
  {
    path: '/document/share',
    method: 'POST',
    handler: 'document.shareDocument',
    authenticated: true,
  },
];
