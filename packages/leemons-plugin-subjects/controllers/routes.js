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
  {
    path: '/settings',
    method: 'GET',
    handler: 'settings.findOne',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.classroom, ['view']),
  },
  {
    path: '/settings',
    method: 'POST',
    handler: 'settings.update',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.classroom, ['edit']),
  },
  {
    path: '/settings/enable-menu-item',
    method: 'POST',
    handler: 'settings.enableMenuItem',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.classroom, ['edit']),
  },
  {
    path: '/tree/detail',
    method: 'GET',
    handler: 'tree.detail',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.classroom, ['view']),
  },
  {
    path: '/levelSchema',
    method: 'POST',
    handler: 'levelSchemas.add',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tree, ['create']),
  },
  {
    path: '/levelSchema/:id',
    method: 'GET',
    handler: 'levelSchemas.get',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tree, ['view']),
  },
  {
    path: '/levelSchema',
    method: 'GET',
    handler: 'levelSchemas.list',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tree, ['view']),
  },
  {
    path: '/levelSchema/:id',
    method: 'DELETE',
    handler: 'levelSchemas.delete',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tree, ['delete']),
  },
  {
    path: '/levelSchema/:id',
    method: 'PATCH',
    handler: 'levelSchemas.update',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tree, ['update']),
  },
  {
    path: '/levelSchema/:id/names',
    method: 'GET',
    handler: 'levelSchemas.getNames',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tree, ['view']),
  },
  {
    path: '/levelSchema/:id/names',
    method: 'PATCH',
    handler: 'levelSchemas.setNames',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tree, ['update']),
  },
  {
    path: '/levelSchema/:id/parent',
    method: 'PATCH',
    handler: 'levelSchemas.setParent',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tree, ['update']),
  },
  {
    path: '/levelSchema/:id/isClass',
    method: 'PATCH',
    handler: 'levelSchemas.setIsClass',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.tree, ['update']),
  },
  {
    path: '/levelSchema/:id/assignables',
    method: 'POST',
    handler: 'levelSchemas.addAssignables',
    authenticated: true,
    allowedPermissions: getPermissions([
      [permissions.tree, ['update']],
      ['plugins.users.profiles', ['view']],
    ]),
  },
  {
    path: '/levelSchema/:id/assignables',
    method: 'DELETE',
    handler: 'levelSchemas.removeAssignables',
    authenticated: true,
    allowedPermissions: getPermissions([
      [permissions.tree, ['update']],
      ['plugins.users.profiles', ['view']],
    ]),
  },

  {
    path: '/level',
    method: 'POST',
    handler: 'levels.add',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.organization, ['create']),
  },
  {
    path: '/level/:id',
    method: 'GET',
    handler: 'levels.get',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.organization, ['view']),
  },
  {
    path: '/level',
    method: 'GET',
    handler: 'levels.list',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.organization, ['view']),
  },
  {
    path: '/level/:id',
    method: 'DELETE',
    handler: 'levels.delete',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.organization, ['delete']),
  },
  {
    path: '/level/:id',
    method: 'PATCH',
    handler: 'levels.update',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.organization, ['update']),
  },
  {
    path: '/level/:id/names',
    method: 'PATCH',
    handler: 'levels.setNames',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.organization, ['update']),
  },
  {
    path: '/level/:id/descriptions',
    method: 'PATCH',
    handler: 'levels.setDescriptions',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.organization, ['update']),
  },
  {
    path: '/level/:id/parent',
    method: 'PATCH',
    handler: 'levels.setParent',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.organization, ['update']),
  },
  {
    path: '/level/:id/users',
    method: 'GET',
    handler: 'levels.getUsers',
    authenticated: true,
    allowedPermissions: getPermissions([
      [permissions.organization, ['view']],
      ['plugins.users.users', ['view']],
    ]),
  },
  {
    path: '/level/:id/permissions',
    method: 'POST',
    handler: 'levels.setPermissions',
    authenticated: true,
    // TODO: set permissions
  },
  {
    path: '/level/:id/users',
    method: 'POST',
    handler: 'levels.addUsers',
    authenticated: true,
    allowedPermissions: getPermissions([
      [permissions.organization, ['assign']],
      ['plugins.users.users', ['view']],
    ]),
  },
  {
    path: '/level/:id/users',
    method: 'DELETE',
    handler: 'levels.removeUsers',
    authenticated: true,
    allowedPermissions: getPermissions([
      [permissions.organization, ['assign']],
      ['plugins.users.users', ['view']],
    ]),
  },
  {
    path: '/users/search',
    method: 'GET',
    handler: 'users.search',
    authenticated: true,
    // TODO: Add permissions
  },
];
