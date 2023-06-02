const { table } = require('../tables');

/**
 * Return default hostname por platform
 * @public
 * @static
 * @param {any} transacting - DB Transaction
 * @return {Promise<string | null>} locale
 * */
async function getHostnameApi({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-hostname-api' }, { transacting });
  return config ? config.value : null;
}

module.exports = getHostnameApi;
