const URL = require('url');
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
  const url = URL.parse(hostname, true);
  return table.config.set(
    { key: 'platform-hostname' },
    {
      key: 'platform-hostname',
      value: `${url.protocol}//${url.host}`,
    },
    { transacting }
  );
}

module.exports = setHostname;
