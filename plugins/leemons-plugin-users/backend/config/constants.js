module.exports = {
  // Time in minutes
  timeForRecoverPassword: 15,
  daysForRegisterPassword: 30,
  // All users always have this permission
  basicPermission: {
    permissionName: 'users.any',
    actionName: 'view',
  },
  defaultPermissions: [
    {
      permissionName: 'users.centers',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Centros', en: 'Centers' },
    },
    {
      permissionName: 'users.user-data',
      actions: ['view', 'update', 'delete', 'admin'],
      localizationName: { es: 'Datos del usuario', en: 'User data' },
    },
    {
      permissionName: 'users.users',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Usuarios', en: 'Users' },
    },
    {
      permissionName: 'users.profiles',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Perfiles', en: 'Profiles' },
    },
    {
      permissionName: 'users.import',
      actions: ['view', 'update', 'admin'],
      localizationName: { es: 'Importar', en: 'Import' },
    },
    {
      permissionName: 'users.roles',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Roles', en: 'Roles' },
    },
    {
      permissionName: 'users.enabledisable',
      actions: ['create', 'delete', 'admin'],
      localizationName: { es: 'Activar/Desactivar', en: 'Enable/Disable' },
    },
  ],
  defaultActions: [
    { order: 1, actionName: 'view', localizationName: { es: 'Ver', en: 'View' } },
    { order: 11, actionName: 'update', localizationName: { es: 'Actualizar', en: 'Update' } },
    { order: 21, actionName: 'create', localizationName: { es: 'Crear', en: 'Create' } },
    { order: 31, actionName: 'delete', localizationName: { es: 'Borrar', en: 'Delete' } },
    { order: 41, actionName: 'assign', localizationName: { es: 'Asignar', en: 'Assign' } },
    { order: 51, actionName: 'admin', localizationName: { es: 'Administrador', en: 'Admin' } },
  ],
  defaultDatasetLocations: [
    {
      name: {
        es: 'Datos del usuarios',
        en: 'User data',
      },
      description: {
        es: 'Añade datos adicionales comunes a todos los usuarios',
        en: 'Adds additional data common to all users',
      },
      locationName: 'user-data',
      pluginName: 'users',
    },
  ],
  url: {
    base: 'users',
    frontend: {
      login: 'public/users/login',
      reset: 'public/users/reset',
      recover: 'public/users/recover',
      register: 'public/users/register',
      authLogin: 'public/users/auth/login',
      authLogout: 'public/users/auth/logout',
    },
    backend: {
      login: 'users/user/login',
      recover: 'users/user/recover',
    },
  },
  widgets: {
    zones: [{ key: 'users.user-detail' }],
  },
  menuItems: [
    {
      item: {
        key: 'users',
        order: 100,
        iconSvg: '/public/users/menu-icon.svg',
        activeIconSvg: '/public/users/menu-icon.svg',
        label: {
          en: 'Users',
          es: 'Usuarios',
        },
      },
      permissions: [
        {
          permissionName: 'users.users',
          actionNames: ['admin'],
        },
      ],
    },
    {
      item: {
        key: 'roles-list',
        order: 1,
        parentKey: 'users.users',
        url: '/private/users/roles/list',
        label: {
          en: 'Roles',
          es: 'Roles',
        },
      },
      permissions: [
        {
          permissionName: 'users.roles',
          actionNames: ['view', 'admin'],
        },
      ],
    },
    {
      item: {
        key: 'profile-list',
        order: 1,
        parentKey: 'users.users',
        url: '/private/users/profiles/list',
        label: {
          en: 'Profiles',
          es: 'Perfiles',
        },
      },
      permissions: [
        {
          permissionName: 'users.profiles',
          actionNames: ['view', 'admin'],
        },
      ],
    },
    {
      item: {
        key: 'user-data',
        parentKey: 'users.users',
        order: 2,
        url: '/private/users/user-data',
        label: {
          en: 'User data',
          es: 'Datos del usuario',
        },
      },
      permissions: [
        {
          permissionName: 'users.user-data',
          actionNames: ['view', 'admin'],
        },
      ],
    },
    {
      item: {
        key: 'users-list',
        order: 3,
        parentKey: 'users.users',
        url: '/private/users/list',
        label: {
          en: 'Users list',
          es: 'Listado de usuarios',
        },
      },
      permissions: [
        {
          permissionName: 'users.users',
          actionNames: ['admin'],
        },
      ],
    },
  ],
};
