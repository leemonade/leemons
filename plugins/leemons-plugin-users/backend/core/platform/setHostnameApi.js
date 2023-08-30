const URL = require('url');
/**
 * Set default hostname por platform
 * @public
 * @static
 * @param {string} hostname - Domain
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setHostnameApi({ value, ctx }) {
  const url = URL.parse(value, true);
  return ctx.tx.db.Config.findOneAndUpdate(
    { key: 'platform-hostname-api' },
    {
      key: 'platform-hostname-api',
      value: `${url.protocol}//${url.host}`,
    },
    {
      lean: true,
      new: true,
      upsert: true,
    }
  );
}

module.exports = setHostnameApi;
