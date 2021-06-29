// TODO COMPROBAR PERMISOS DE LOS ENDPOINTS

module.exports = [
  /**
   * Users
   * */
  {
    path: '/user/login',
    method: 'POST',
    handler: 'users.login',
  },
  {
    path: '/user/recover',
    method: 'POST',
    handler: 'users.recover',
  },
  {
    path: '/user/reset',
    method: 'POST',
    handler: 'users.reset',
  },
  {
    path: '/user/can/reset',
    method: 'POST',
    handler: 'users.canReset',
  },
  {
    path: '/user',
    method: 'GET',
    handler: 'users.detail',
    authenticated: true,
  },
  {
    path: '/user/list',
    method: 'POST',
    handler: 'users.list',
    authenticated: true,
    allowedPermissions: {
      'plugins.users-groups-roles.users': {
        actions: ['view', 'update', 'create', 'delete', 'admin'],
      },
    },
  },
  {
    path: '/user',
    method: 'POST',
    handler: 'users.create',
  },
  {
    path: '/super-admin',
    method: 'POST',
    handler: 'users.createSuperAdmin',
  },
  /**
   * Profiles
   * */
  {
    path: '/profile/list',
    method: 'POST',
    handler: 'profiles.list',
    authenticated: true,
    allowedPermissions: {
      'plugins.users-groups-roles.profiles': {
        actions: ['view', 'update', 'create', 'delete', 'admin'],
      },
    },
  },
  {
    path: '/profile/add',
    method: 'POST',
    handler: 'profiles.add',
    authenticated: true,
    allowedPermissions: {
      'plugins.users-groups-roles.profiles': {
        actions: ['create', 'admin'],
      },
    },
  },
  {
    path: '/profile/detail/:uri',
    method: 'GET',
    handler: 'profiles.detail',
    authenticated: true,
    allowedPermissions: {
      'plugins.users-groups-roles.profiles': {
        actions: ['view', 'update', 'create', 'delete', 'admin'],
      },
    },
  },
  {
    path: '/profile/update',
    method: 'POST',
    handler: 'profiles.update',
    authenticated: true,
    allowedPermissions: {
      'plugins.users-groups-roles.profiles': {
        actions: ['update', 'admin'],
      },
    },
  },
  /**
   * Permissions
   * */
  {
    path: '/permission/list',
    method: 'GET',
    handler: 'permissions.list',
    authenticated: true,
  },
  /**
   * Actions
   * */
  {
    path: '/action/list',
    method: 'GET',
    handler: 'actions.list',
    authenticated: true,
  },
  /**
   * Roles
   * */
  {
    path: '/role',
    method: 'GET',
    handler: 'roles.list',
  },
  {
    path: '/role',
    method: 'POST',
    handler: 'roles.create',
  },
  {
    path: '/role/:id',
    method: 'PUT',
    handler: 'roles.create',
  },
];
