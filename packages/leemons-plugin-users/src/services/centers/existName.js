const { table } = require('../tables');

/**
 * Return true if exist center with this name, false if not
 * @private
 * @static
 * @param {string} name
 * @param {any=} transacting -  DB Transaction
 * @return {Promise<boolean>}
 * */
async function existName(name, { transacting } = {}) {
  const exist = await table.centers.count({ name }, { transacting });
  return !!exist;
}

module.exports = existName;
