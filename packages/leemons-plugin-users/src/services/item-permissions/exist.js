const { table } = require('../tables');

/**
 * ES:
 * Comprueba para los parametros especificados si exista ya o no algún registro
 *
 * EN:
 * Checks for the specified parameters whether or not a record already exists.
 *
 * @public
 * @static
 * @param {ItemPermission} query -
 * @param {any=} transacting - DB Transaction
 * @return {Promise<any>}
 * */
async function exist(query, { transacting } = {}) {
  const response = await table.itemPermissions.count(query, { transacting });
  return !!response;
}

module.exports = { exist };
