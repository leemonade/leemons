module.exports = {
  // Time in minutes
  timeForRecoverPassword: 30,
  // TODO Añadir listado de roles basicos
  defaultRoles: [
    { name: 'Administrador', permissions: ['add-users', 'show-users', 'delete-users'] },
  ],
  // TODO Añadir listado de permisos basicos
  defaultPermissions: [
    { name: 'Añadir usuarios', permissionName: 'add-users', pluginName: 'Users' },
    { name: 'Ver usuarios', permissionName: 'show-users', pluginName: 'Users' },
    { name: 'Borrar usuarios', permissionName: 'delete-users', pluginName: 'Users' },
  ],
};
