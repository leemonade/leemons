const SYS_PROFILE_NAMES = {
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  ADMIN: 'admin',
};
const PLUGIN_NAME = 'users';
const PUBLIC_ROUTE = `public/${PLUGIN_NAME}`;
const PRIVATE_ROUTE = `private/${PLUGIN_NAME}`;
const USERS_PERMISSION_NAME = `${PLUGIN_NAME}.users`;

module.exports = {
  // Time in minutes
  timeForRecoverPassword: 15,
  daysForRegisterPassword: 30,
  // All users always have this permission
  basicPermission: {
    permissionName: `${PLUGIN_NAME}.any`,
    actionName: 'view',
  },
  defaultPermissions: [
    {
      permissionName: `${PLUGIN_NAME}.centers`,
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Centros', en: 'Centers' },
    },
    {
      permissionName: `${PLUGIN_NAME}.user-data`,
      actions: ['view', 'update', 'delete', 'admin'],
      localizationName: { es: 'Datos del usuario', en: 'User data' },
    },
    {
      permissionName: USERS_PERMISSION_NAME,
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Usuarios', en: 'Users' },
    },
    {
      permissionName: `${PLUGIN_NAME}.profiles`,
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Perfiles', en: 'Profiles' },
    },
    {
      permissionName: `${PLUGIN_NAME}.import`,
      actions: ['view', 'update', 'admin'],
      localizationName: { es: 'Importar', en: 'Import' },
    },
    {
      permissionName: `${PLUGIN_NAME}.roles`,
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Roles', en: 'Roles' },
    },
    {
      permissionName: `${PLUGIN_NAME}.enabledisable`,
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
      pluginName: PLUGIN_NAME,
    },
  ],
  url: {
    base: 'users',
    frontend: {
      login: `${PUBLIC_ROUTE}/login`,
      reset: `${PUBLIC_ROUTE}/reset`,
      recover: `${PUBLIC_ROUTE}/recover`,
      register: `${PUBLIC_ROUTE}/register`,
      authLogin: `${PUBLIC_ROUTE}/auth/login`,
      authLogout: `${PUBLIC_ROUTE}/auth/logout`,
    },
    backend: {
      login: `${PLUGIN_NAME}/user/login`,
      recover: `${PLUGIN_NAME}/user/recover`,
    },
  },
  widgets: {
    zones: [{ key: `${PLUGIN_NAME}.user-detail` }],
  },
  menuItems: [
    {
      item: {
        key: 'users',
        order: 100,
        iconSvg: `/${PUBLIC_ROUTE}/menu-icon.svg`,
        activeIconSvg: `/${PUBLIC_ROUTE}/menu-icon.svg`,
        label: {
          en: 'Users',
          es: 'Usuarios',
        },
      },
      permissions: [
        {
          permissionName: USERS_PERMISSION_NAME,
          actionNames: ['admin'],
        },
      ],
    },
    {
      item: {
        key: 'roles-list',
        order: 1,
        parentKey: USERS_PERMISSION_NAME,
        url: `/${PRIVATE_ROUTE}/roles/list`,
        label: {
          en: 'Roles',
          es: 'Roles',
        },
      },
      permissions: [
        {
          permissionName: `${PLUGIN_NAME}.roles`,
          actionNames: ['view', 'admin'],
        },
      ],
    },
    {
      item: {
        key: 'profile-list',
        order: 1,
        parentKey: USERS_PERMISSION_NAME,
        url: `/${PRIVATE_ROUTE}/profiles/list`,
        label: {
          en: 'Profiles',
          es: 'Perfiles',
        },
      },
      permissions: [
        {
          permissionName: `${PLUGIN_NAME}.profiles`,
          actionNames: ['view', 'admin'],
        },
      ],
    },
    {
      item: {
        key: 'user-data',
        parentKey: USERS_PERMISSION_NAME,
        order: 2,
        url: `/${PRIVATE_ROUTE}/user-data`,
        label: {
          en: 'User data',
          es: 'Datos del usuario',
        },
      },
      permissions: [
        {
          permissionName: `${PLUGIN_NAME}.user-data`,
          actionNames: ['view', 'admin'],
        },
      ],
    },
    {
      item: {
        key: 'users-list',
        order: 3,
        parentKey: USERS_PERMISSION_NAME,
        url: `/${PRIVATE_ROUTE}/list`,
        label: {
          en: 'Users list',
          es: 'Listado de usuarios',
        },
      },
      permissions: [
        {
          permissionName: USERS_PERMISSION_NAME,
          actionNames: ['admin'],
        },
      ],
    },
  ],
  VERSION: 1,
  PLUGIN_NAME,
  SYS_PROFILE_NAMES,
};
