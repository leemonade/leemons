module.exports = {
  // Time in minutes
  timeForRecoverPassword: 15,
  // All users always have this permission
  basicPermission: {
    permissionName: 'plugins.users.any',
    actionName: 'view',
  },
  // TODO Añadir listado de permisos basicos
  defaultPermissions: [
    {
      permissionName: 'plugins.users.centers',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Centros', en: 'Centers' },
    },
    {
      permissionName: 'plugins.users.user-data',
      actions: ['view', 'update', 'delete', 'admin'],
      localizationName: { es: 'Datos del usuario', en: 'User data' },
    },
    {
      permissionName: 'plugins.users.users',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Usuarios', en: 'Users' },
    },
    {
      permissionName: 'plugins.users.profiles',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { es: 'Perfiles', en: 'Profiles' },
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
      pluginName: 'plugins.users',
    },
  ],
  url: {
    base: 'users',
    frontend: {
      login: 'users/public/login',
      reset: 'users/public/reset',
      recover: 'users/public/recover',
      register: 'users/public/register',
      authLogin: 'users/public/auth/login',
      authLogout: 'users/public/auth/logout',
    },
    backend: {
      login: 'users/user/login',
      recover: 'users/user/recover',
    },
  },
};
