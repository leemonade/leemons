const users = require('../src/services/users');

module.exports = {
  isSuperAdmin: users.isSuperAdmin,
  detailForJWT: users.detailForJWT,
  hasPermissionCTX: users.hasPermissionCTX,
  getUserPermissions: users.getUserPermissions,
  // TODO Solo deberian de tener acceso los plugins que tengan permiso a ejecutar dichas funciones o los usuarios con permiso
  add: users.add,
  // TODO Pensar si los plugins deberian de solicitar permiso o si darle acceso siempre
  addCustomPermission: users.addCustomPermission,
  removeCustomPermission: users.removeCustomPermission,
  hasPermission: users.hasPermission,
};
