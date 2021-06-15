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
    { permissionName: 'view', localizationName: { 'es-ES': 'Ver', en: 'View' } },
    { permissionName: 'change', localizationName: { 'es-ES': 'Cambiar', en: 'Change' } },
    { permissionName: 'update', localizationName: { 'es-ES': 'Actualizar', en: 'Update' } },
    { permissionName: 'create', localizationName: { 'es-ES': 'Crear', en: 'Create' } },
    { permissionName: 'delete', localizationName: { 'es-ES': 'Borrar', en: 'Delete' } },
    { permissionName: 'assign', localizationName: { 'es-ES': 'Asignar', en: 'Assign' } },
    { permissionName: 'admin', localizationName: { 'es-ES': 'Administrador', en: 'Admin' } },
  ],
};
