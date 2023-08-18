const { getRegisterPasswordConfig } = require('./getRegisterPasswordConfig');

async function canRegisterPassword({ token, ctx }) {
  try {
    await getRegisterPasswordConfig({ token, ctx });
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { canRegisterPassword };
