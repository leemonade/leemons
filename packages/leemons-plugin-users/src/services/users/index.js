const { add } = require('./add');
const { init } = require('./init');
const { list } = require('./list');
const { exist } = require('./exist');
const { login } = require('./login');
const { reset } = require('./reset');
const { detail } = require('./detail');
const { recover } = require('./recover');
const { canReset } = require('./canReset');
const { profiles } = require('./profiles');
const { isSuperAdmin } = require('./isSuperAdmin');
const { profileToken } = require('./profileToken');
const { getResetConfig } = require('./getResetConfig');
const { comparePassword } = require('./bcrypt/comparePassword');
const { encryptPassword } = require('./bcrypt/encryptPassword');
const { hasPermissionCTX } = require('./hasPermissionCTX');
const { getSuperAdminUserIds } = require('./getSuperAdminUserIds');
const { addFirstSuperAdminUser } = require('./addFirstSuperAdminUser');

// JWT
const { detailForJWT } = require('./jwt/detailForJWT');
const { verifyJWTToken } = require('./jwt/verifyJWTToken');
const { generateJWTToken } = require('./jwt/generateJWTToken');
const { getJWTPrivateKey } = require('./jwt/getJWTPrivateKey');
const { generateJWTPrivateKey } = require('./jwt/generateJWTPrivateKey');

module.exports = {
  add,
  init,
  list,
  exist,
  login,
  reset,
  detail,
  recover,
  canReset,
  profiles,
  isSuperAdmin,
  profileToken,
  getResetConfig,
  comparePassword,
  encryptPassword,
  hasPermissionCTX,
  getSuperAdminUserIds,
  addFirstSuperAdminUser,
  jwt: {
    detailForJWT,
    verifyJWTToken,
    generateJWTToken,
    getJWTPrivateKey,
    generateJWTPrivateKey,
  },
};
