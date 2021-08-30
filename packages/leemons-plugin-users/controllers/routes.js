// TODO COMPROBAR PERMISOS DE LOS ENDPOINTS

module.exports = [
  /**
   * Init config
   * */
  {
    path: '/init/status',
    method: 'GET',
    handler: 'init.status',
  },
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
    path: '/user/profile',
    method: 'GET',
    handler: 'users.profiles',
    authenticated: true,
  },
  {
    path: '/user/remember/profile',
    method: 'GET',
    handler: 'users.getRememberProfile',
    authenticated: true,
  },
  {
    path: '/user/remember/profile',
    method: 'POST',
    handler: 'users.setRememberProfile',
    authenticated: true,
  },
  {
    path: '/user/profile/:id/token',
    method: 'GET',
    handler: 'users.profileToken',
    authenticated: true,
  },
  {
    path: '/user/list',
    method: 'POST',
    handler: 'users.list',
    authenticated: true,
    allowedPermissions: {
      'plugins.users.users': {
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
      'plugins.users.profiles': {
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
      'plugins.users.profiles': {
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
      'plugins.users.profiles': {
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
      'plugins.users.profiles': {
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
  {
    path: '/permission/get-if-have',
    method: 'POST',
    handler: 'permissions.getPermissionsWithActionsIfIHave',
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
    method: 'POST',
    handler: 'roles.create',
  },
  {
    path: '/role/:id',
    method: 'PUT',
    handler: 'roles.create',
  },
  /**
   * Centers
   * */
  {
    path: '/centers',
    method: 'POST',
    handler: 'centers.list',
    authenticated: true,
    allowedPermissions: {
      'plugins.users.centers': {
        actions: ['view', 'update', 'create', 'delete', 'admin'],
      },
    },
  },

  /**
   * Platform
   * */
  {
    path: '/platform/default-locale',
    method: 'GET',
    handler: 'platform.getDefaultLocale',
  },
  {
    path: '/platform/locales',
    method: 'GET',
    handler: 'platform.getLocales',
  },
];
