const { validateNotExistValues } = require('../../validations/exists');
const { validatePluginName } = require('../../validations/exists');
const { table } = require('../tables');

/** *
 *  ES:
 *  Si existen los datos especificados los elimina
 *
 *  EN:
 *  If the specified data exists, it is deleted
 *
 *  @public
 *  @static
 *  @param {string} locationName Location name (For backend)
 *  @param {string} pluginName Plugin name (For backend)
 *  @param {any=} transacting - DB Transaction
 *  @param {string=} target Any string to differentiate what you want, for example a user id.
 *  @return {Promise<boolean>}
 *  */
async function deleteValues(locationName, pluginName, { target, transacting } = {}) {
  validatePluginName(pluginName, this.calledFrom);
  await validateNotExistValues(locationName, pluginName, target, { transacting });

  const query = { locationName, pluginName };
  if (target) query.target = target;

  await table.datasetValues.deleteMany(query, { transacting });

  return true;
}

module.exports = deleteValues;
