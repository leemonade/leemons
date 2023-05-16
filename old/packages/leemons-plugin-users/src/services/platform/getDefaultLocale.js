const { table } = require('../tables');

/**
 * Return default locale por platform
 * @public
 * @static
 * @param {any} transacting - DB Transaction
 * @return {Promise<string | null>} locale
 * */
async function getDefaultLocale({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-locale' }, { transacting });
  return config ? config.value : null;
}

module.exports = getDefaultLocale;
