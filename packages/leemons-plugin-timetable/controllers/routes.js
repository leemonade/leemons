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
  // Timetable config
  {
    method: 'POST',
    path: '/config',
    handler: 'config.create',
    authenticated: true,
    allowedPermissions: {
      [permissions.config]: {
        actions: ['create'],
      },
    },
  },
  {
    method: 'GET',
    path: '/config',
    handler: 'config.get',
    authenticated: true,
    allowedPermissions: {
      [permissions.config]: {
        actions: ['view'],
      },
    },
  },
  {
    method: 'GET',
    path: '/config/has',
    handler: 'config.has',
    authenticated: true,
    allowedPermissions: {
      [permissions.config]: {
        actions: ['view'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/config',
    handler: 'config.update',
    authenticated: true,
    allowedPermissions: {
      [permissions.config]: {
        actions: ['update'],
      },
    },
  },
  {
    method: 'DELETE',
    path: '/config',
    handler: 'config.delete',
    authenticated: true,
    allowedPermissions: {
      [permissions.config]: {
        actions: ['delete'],
      },
    },
  },

  // Timetable
  {
    method: 'POST',
    path: '/timetable',
    handler: 'timetable.create',
    authenticated: true,
    allowedPermissions: {
      [permissions.timetable]: {
        actions: ['create'],
      },
    },
  },
  {
    method: 'GET',
    path: '/timetable/:id',
    handler: 'timetable.get',
    authenticated: true,
    allowedPermissions: {
      [permissions.timetable]: {
        actions: ['view'],
      },
    },
  },
  {
    method: 'GET',
    path: '/timetable/count/:id',
    handler: 'timetable.count',
    authenticated: true,
    allowedPermissions: {
      [permissions.timetable]: {
        actions: ['view'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/timetable/:id',
    handler: 'timetable.update',
    authenticated: true,
    allowedPermissions: {
      [permissions.timetable]: {
        actions: ['update'],
      },
    },
  },
  {
    method: 'DELETE',
    path: '/timetable/:id',
    handler: 'timetable.delete',
    authenticated: true,
    allowedPermissions: {
      [permissions.timetable]: {
        actions: ['delete'],
      },
    },
  },
  {
    path: '/settings',
    method: 'GET',
    handler: 'settings.findOne',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.config, ['view']),
  },
  {
    path: '/settings',
    method: 'POST',
    handler: 'settings.update',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.config, ['edit']),
  },
  {
    path: '/settings/enable-menu-item',
    method: 'POST',
    handler: 'settings.enableMenuItem',
    authenticated: true,
    allowedPermissions: getPermissions(permissions.config, ['edit']),
  },
];
