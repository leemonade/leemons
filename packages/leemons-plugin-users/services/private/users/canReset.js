const { getResetConfig } = require('./getResetConfig');

/**
 * Return if canReset password with the provided token
 * @public
 * @static
 * @param {string} token - User token
 * @return {Promise<boolean>}
 * */
async function canReset(token) {
  try {
    await getResetConfig(token);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = { canReset };
