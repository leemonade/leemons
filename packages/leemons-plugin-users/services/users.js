const users = require('../src/services/users');

module.exports = {
  isSuperAdmin: users.isSuperAdmin,
  detailForJWT: users.detailForJWT,
  havePermission: users.havePermission,
  getUserPermissions: users.getUserPermissions,
};
