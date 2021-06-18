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
      permissionName: 'users',
      actions: ['view', 'update', 'create', 'delete', 'admin'],
      localizationName: { 'es-ES': 'Usuarios', en: 'Users' },
    },
  ],
  defaultActions: [
    { actionName: 'view', localizationName: { 'es-ES': 'Ver', en: 'View' } },
    { actionName: 'change', localizationName: { 'es-ES': 'Cambiar', en: 'Change' } },
    { actionName: 'update', localizationName: { 'es-ES': 'Actualizar', en: 'Update' } },
    { actionName: 'create', localizationName: { 'es-ES': 'Crear', en: 'Create' } },
    { actionName: 'delete', localizationName: { 'es-ES': 'Borrar', en: 'Delete' } },
    { actionName: 'assign', localizationName: { 'es-ES': 'Asignar', en: 'Assign' } },
    { actionName: 'admin', localizationName: { 'es-ES': 'Administrador', en: 'Admin' } },
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
