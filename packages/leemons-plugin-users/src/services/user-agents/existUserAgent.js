const { table } = require('../tables');

/**
 * Check if user exists
 * @public
 * @static
 * @param {any} query
 * @param {boolean} throwErrorIfNotExists
 * @param {any=} transacting - DB Transaction
 * @return {Promise<boolean>}
 * */
async function existUserAgent(query, throwErrorIfNotExists, { transacting } = {}) {
  const count = await table.userAgent.count(query, { transacting });
  if (throwErrorIfNotExists && !count) throw new Error('User auth not found');
  return !!count;
}

module.exports = {
  existUserAgent,
};
