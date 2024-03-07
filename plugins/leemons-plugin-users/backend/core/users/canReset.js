const { getResetConfig } = require('./getResetConfig');

/**
 * Return if canReset password with the provided token
 * @public
 * @static
 * @param {string} token - User token
 * @return {Promise<boolean>}
 * */
async function canReset({ token, ctx }) {
  try {
    await getResetConfig({ token, ctx });
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { canReset };
