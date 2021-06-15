const users = require('./private/users');

module.exports = {
  detailForJWT: users.detailForJWT,
  havePermission: users.havePermission,
};
