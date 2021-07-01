module.exports = {
  // Time in minutes
  timeForRecoverPassword: 15,
  // TODO Añadir listado de roles basicos
  defaultRoles: [
    { name: 'Administrador', permissions: ['add-users', 'show-users', 'delete-users'] },
  ],
  // TODO Añadir listado de permisos basicos
  defaultPermissions: [
    {
      permissionName: 'plugins.users.users',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { 'es-ES': 'Usuarios', en: 'Users' },
    },
    {
      permissionName: 'plugins.users.profiles',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { 'es-ES': 'Perfiles', en: 'profiles' },
    },
  ],
  defaultActions: [
    { order: 1, actionName: 'view', localizationName: { 'es-ES': 'Ver', en: 'View' } },
    { order: 11, actionName: 'change', localizationName: { 'es-ES': 'Cambiar', en: 'Change' } },
    { order: 21, actionName: 'update', localizationName: { 'es-ES': 'Actualizar', en: 'Update' } },
    { order: 31, actionName: 'create', localizationName: { 'es-ES': 'Crear', en: 'Create' } },
    { order: 41, actionName: 'delete', localizationName: { 'es-ES': 'Borrar', en: 'Delete' } },
    { order: 51, actionName: 'assign', localizationName: { 'es-ES': 'Asignar', en: 'Assign' } },
    { order: 61, actionName: 'admin', localizationName: { 'es-ES': 'Administrador', en: 'Admin' } },
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
