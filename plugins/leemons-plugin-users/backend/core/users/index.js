const { activateUser } = require('./activateUser');
const { add } = require('./add');
const { addBulk } = require('./addBulk');
const { addFirstSuperAdminUser } = require('./addFirstSuperAdminUser');
const { comparePassword } = require('./bcrypt/comparePassword');
const { encryptPassword } = require('./bcrypt/encryptPassword');
const { canRegisterPassword } = require('./canRegisterPassword');
const { canReset } = require('./canReset');
const { centerProfileToken } = require('./centerProfileToken');
const { centers } = require('./centers');
const { detail } = require('./detail');
const { detailForPage } = require('./detailForPage');
const { exist } = require('./exist');
const { getDataForUserDatasets } = require('./getDataForUserDatasets');
const { getRegisterPasswordConfig } = require('./getRegisterPasswordConfig');
const { getResetConfig } = require('./getResetConfig');
const { getSuperAdminUserIds } = require('./getSuperAdminUserIds');
const { hasPermissionCTX } = require('./hasPermissionCTX');
const { init } = require('./init');
const { isSuperAdmin } = require('./isSuperAdmin');
const { detailForJWT } = require('./jwt/detailForJWT');
const { generateJWTPrivateKey } = require('./jwt/generateJWTPrivateKey');
const { generateJWTToken } = require('./jwt/generateJWTToken');
const { getJWTPrivateKey } = require('./jwt/getJWTPrivateKey');
const { verifyJWTToken } = require('./jwt/verifyJWTToken');
const { list } = require('./list');
const { login } = require('./login');
const { profileToken } = require('./profileToken');
const { profiles } = require('./profiles');
const { recover } = require('./recover');
const { registerPassword } = require('./registerPassword');
const { reset } = require('./reset');
const { saveDataForUserDatasets } = require('./saveDataForUserDatasets');
const { sendWelcomeEmailToUser } = require('./sendWelcomeEmailToUser');
const { update } = require('./update');
const { updateAvatar } = require('./updateAvatar');
const { updateEmail } = require('./updateEmail');
const { updatePassword } = require('./updatePassword');
const { updateSessionConfig } = require('./updateSessionConfig');
const { userSessionCheckUserAgentDatasets } = require('./userSessionCheckUserAgentDatasets');

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
  getDataForUserDatasets,
  sendWelcomeEmailToUser,
  saveDataForUserDatasets,
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
