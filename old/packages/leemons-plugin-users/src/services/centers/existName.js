const { table } = require('../tables');

/**
 * Return true if exist center with this name, false if not
 * @private
 * @static
 * @param {string} name
 * @param {any=} transacting -  DB Transaction
 * @return {Promise<boolean>}
 * */
async function existName(name, { id, transacting } = {}) {
  const query = { name };
  if (id) {
    query.id_$ne = id;
  }
  const exist = await table.centers.count(query, { transacting });
  return !!exist;
}

module.exports = existName;
