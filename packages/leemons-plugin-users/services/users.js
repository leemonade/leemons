const users = require('../src/services/users');

module.exports = {
  detailForJWT: users.detailForJWT,
  havePermission: users.havePermission,
};
