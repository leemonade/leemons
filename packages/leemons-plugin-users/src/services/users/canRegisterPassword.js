const { getRegisterPasswordConfig } = require('./getRegisterPasswordConfig');

async function canRegisterPassword(token) {
  try {
    await getRegisterPasswordConfig(token);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { canRegisterPassword };
