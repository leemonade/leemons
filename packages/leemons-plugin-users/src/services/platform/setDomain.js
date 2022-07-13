const { table } = require('../tables');

/**
 * Set default domain por platform
 * @public
 * @static
 * @param {string} domain - Domain
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setDomain(domain, { transacting } = {}) {
  const url = new URL(domain);
  return table.config.set(
    { key: 'platform-domain' },
    {
      key: 'platform-domain',
      value: url.origin,
    },
    { transacting }
  );
}

module.exports = setDomain;
