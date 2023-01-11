const { add } = require('./add');
const { init } = require('./init');
const { list } = require('./list');
const { exist } = require('./exist');
const { login } = require('./login');
const { reset } = require('./reset');
const { detail } = require('./detail');
const { update } = require('./update');
const { addBulk } = require('./addBulk');
const { recover } = require('./recover');
const { centers } = require('./centers');
const { canReset } = require('./canReset');
const { profiles } = require('./profiles');
const { isSuperAdmin } = require('./isSuperAdmin');
const { profileToken } = require('./profileToken');
const { detailForPage } = require('./detailForPage');
const { getResetConfig } = require('./getResetConfig');
const { updateEmail } = require('./updateEmail');
const { updatePassword } = require('./updatePassword');
const { canRegisterPassword } = require('./canRegisterPassword');
const { comparePassword } = require('./bcrypt/comparePassword');
const { encryptPassword } = require('./bcrypt/encryptPassword');
const { hasPermissionCTX } = require('./hasPermissionCTX');
const { registerPassword } = require('./registerPassword');
const { centerProfileToken } = require('./centerProfileToken');
const { updateAvatar } = require('./updateAvatar');
const { activateUser } = require('./activateUser');

const { getSuperAdminUserIds } = require('./getSuperAdminUserIds');
const { addFirstSuperAdminUser } = require('./addFirstSuperAdminUser');
const { sendWelcomeEmailToUser } = require('./sendWelcomeEmailToUser');
const { getRegisterPasswordConfig } = require('./getRegisterPasswordConfig');
const { userSessionCheckUserAgentDatasets } = require('./userSessionCheckUserAgentDatasets');

// JWT
const { detailForJWT } = require('./jwt/detailForJWT');
const { verifyJWTToken } = require('./jwt/verifyJWTToken');
const { generateJWTToken } = require('./jwt/generateJWTToken');
const { getJWTPrivateKey } = require('./jwt/getJWTPrivateKey');
const { generateJWTPrivateKey } = require('./jwt/generateJWTPrivateKey');
const { updateSessionConfig } = require('./updateSessionConfig');

module.exports = {
  add,
  init,
  list,
  exist,
  login,
  reset,
  detail,
  update,
  addBulk,
  recover,
  centers,
  canReset,
  profiles,
  updateEmail,
  activateUser,
  updateAvatar,
  isSuperAdmin,
  profileToken,
  detailForPage,
  getResetConfig,
  updatePassword,
  comparePassword,
  encryptPassword,
  registerPassword,
  hasPermissionCTX,
  centerProfileToken,
  canRegisterPassword,
  updateSessionConfig,
  getSuperAdminUserIds,
  addFirstSuperAdminUser,
  sendWelcomeEmailToUser,
  getRegisterPasswordConfig,
  userSessionCheckUserAgentDatasets,
  jwt: {
    detailForJWT,
    verifyJWTToken,
    generateJWTToken,
    getJWTPrivateKey,
    generateJWTPrivateKey,
  },
};
