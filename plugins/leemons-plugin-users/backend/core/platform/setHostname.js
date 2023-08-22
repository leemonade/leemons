const URL = require('url');
/**
 * Set default hostname por platform
 * @public
 * @static
 * @param {string} hostname - Domain
 * @param {any} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function setHostname({ value, ctx }) {
  // TODO @askJaime: He cambiado en la línea de abajo hostname a value, bien?
  const url = URL.parse(value, true);
  return ctx.tx.db.Config.updateOne(
    { key: 'platform-hostname' },
    {
      key: 'platform-hostname',
      value: `${url.protocol}//${url.host}`,
    },
    {
      upsert: true,
    }
  );
}

module.exports = setHostname;
