const { table } = require('../tables');

/**
 * Return true if exist center with this id, false if not
 * @private
 * @static
 * @param {string} id
 * @param {any=} transacting -  DB Transaction
 * @return {Promise<boolean>}
 * */
async function exist(id, { transacting } = {}) {
  const exist = await table.centers.count({ id }, { transacting });
  return !!exist;
}

module.exports = exist;
