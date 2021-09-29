const { existUserAgent } = require('./existUserAgent');
const { init } = require('./init');
const { list } = require('./list');
const { detailForJWT } = require('./detailForJWT');
const { detail } = require('./detail');
const { updateUserAgentPermissions } = require('./updateUserAgentPermissions');
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
const add = require('./add');
const profiles = require('./profiles');
const profileToken = require('./profileToken');
const hasPermission = require('./hasPermission');
const hasPermissionCTX = require('./hasPermissionCTX');
const removeCustomPermission = require('./removeCustomPermission');
const { searchUserAgents } = require('./searchUserAgents');
const { getUserAgentCenter } = require('./getUserAgentCenter');

module.exports = {
  init,

  login,
  recover,
  reset,
  detail,
  list,

  exist,
  existUserAgent,

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
  hasPermissionCTX,
  updateUserAgentPermissions,
  detailForJWT,

  searchUserAgents,

  add,
  profiles,
  profileToken,
  hasPermission,
  removeCustomPermission,

  getUserAgentCenter,
};
