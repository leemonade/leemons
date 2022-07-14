const { table } = require('../tables');

/**
 * Set default hostname por platform
 * @public
 * @static
 * @param {string} hostname - Domain
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setHostname(hostname, { transacting } = {}) {
  const url = new URL(hostname);
  return table.config.set(
    { key: 'platform-hostname' },
    {
      key: 'platform-hostname',
      value: url.origin,
    },
    { transacting }
  );
}

module.exports = setHostname;
