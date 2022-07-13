const { table } = require('../tables');

/**
 * Return default domain por platform
 * @public
 * @static
 * @param {any} transacting - DB Transaction
 * @return {Promise<string | null>} locale
 * */
async function getDomain({ transacting } = {}) {
  const config = await table.config.findOne({ key: 'platform-domain' }, { transacting });
  return config ? config.value : null;
}

module.exports = getDomain;
