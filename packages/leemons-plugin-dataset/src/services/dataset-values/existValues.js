const { table } = require('../tables');

/** *
 *  ES:
 *  Comprueba si ya existen valores para los datos especificados
 *
 *  EN:
 *  Checks if values for the specified data already exist
 *
 *  @public
 *  @static
 *  @param {string} locationName Location name (For backend)
 *  @param {string} pluginName Plugin name (For backend)
 *  @param {any=} transacting - DB Transaction
 *  @param {string=} target Any string to differentiate what you want, for example a user id.
 *  @return {Promise<boolean>}
 *  */
async function existValues(locationName, pluginName, { target, transacting } = {}) {
  const query = { locationName, pluginName };
  if (target) query.target = target;
  const count = await table.datasetValues.count(query, { transacting });
  return !!count;
}

module.exports = existValues;
