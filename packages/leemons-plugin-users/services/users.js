const users = require('../src/services/users');

module.exports = {
  isSuperAdmin: users.isSuperAdmin,
  detailForJWT: users.detailForJWT,
  hasPermission: users.hasPermission,
  getUserPermissions: users.getUserPermissions,
  // TODO Solo deberian de tener acceso los plugins que tengan permiso a ejecutar dichas funciones o los usuarios con permiso
  add: users.add,
};
