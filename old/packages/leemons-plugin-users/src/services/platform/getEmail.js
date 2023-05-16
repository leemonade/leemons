const { table } = require('../tables');

/**
 * Return default email por platform
 * @public
 * @static
 * @param {any} transacting - DB Transaction
 * @return {Promise<string | null>} locale
 * */
async function getEmail({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-email' }, { transacting });
  return config ? config.value : null;
}

module.exports = getEmail;
