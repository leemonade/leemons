const { existUserAuth } = require('./existUserAuth');
const { init } = require('./init');
const { list } = require('./list');
const { detailForJWT } = require('./detailForJWT');
const { detail } = require('./detail');
const { updateUserAuthPermissions } = require('./updateUserAuthPermissions');
const { havePermission } = require('./havePermission');
const { isSuperAdmin } = require('./isSuperAdmin');
const { reset } = require('./reset');
const { getSuperAdminUserIds } = require('./getSuperAdminUserIds');
const { getResetConfig } = require('./getResetConfig');
const { canReset } = require('./canReset');
const { recover } = require('./recover');
const { addFirstSuperAdminUser } = require('./addFirstSuperAdminUser');
const { login } = require('./login');
const { comparePassword } = require('./comparePassword');
const { encryptPassword } = require('./encryptPassword');
const { verifyJWTToken } = require('./verifyJWTToken');
const { generateJWTToken } = require('./generateJWTToken');
const { getJWTPrivateKey } = require('./getJWTPrivateKey');
const { generateJWTPrivateKey } = require('./generateJWTPrivateKey');
const { exist } = require('./exist');

module.exports = {
  init,

  login,
  recover,
  reset,
  detail,
  list,

  exist,
  existUserAuth,

  addFirstSuperAdminUser,
  generateJWTPrivateKey,
  getJWTPrivateKey,
  generateJWTToken,
  verifyJWTToken,
  encryptPassword,
  comparePassword,
  canReset,
  getResetConfig,
  getSuperAdminUserIds,
  isSuperAdmin,
  havePermission,
  updateUserAuthPermissions,
  detailForJWT,
};
