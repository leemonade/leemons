module.exports = {
  actionsName: 'plugins.users-groups-roles',
  permissionsName: 'plugins.users-groups-roles',
  // Time in minutes
  timeForRecoverPassword: 15,
  // TODO Añadir listado de roles basicos
  defaultRoles: [
    { name: 'Administrador', permissions: ['add-users', 'show-users', 'delete-users'] },
  ],
  // TODO Añadir listado de permisos basicos
  defaultPermissions: [
    {
      permissionName: 'users',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { 'es-ES': 'Usuarios', en: 'Users' },
    },
    {
      permissionName: 'profiles',
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
    base: 'users-groups-roles',
    frontend: {
      login: 'users-groups-roles/public/login',
      reset: 'users-groups-roles/public/reset',
      recover: 'users-groups-roles/public/recover',
      register: 'users-groups-roles/public/register',
      authLogin: 'users-groups-roles/public/auth/login',
      authLogout: 'users-groups-roles/public/auth/logout',
    },
    backend: {
      login: 'users-groups-roles/user/login',
      recover: 'users-groups-roles/user/recover',
    },
  },
};
