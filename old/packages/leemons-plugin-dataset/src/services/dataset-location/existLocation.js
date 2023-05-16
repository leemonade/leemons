const { validateLocationAndPlugin } = require('../../validations/dataset-location');
const { table } = require('../tables');

/**
 * ES:
 * Comprueba si existe una localizacion para ese nombre y para el plugin actual o el especificado
 *
 * EN:
 * Check if there is a locale for that name and for the current or specified plugin.
 *
 * @public
 * @static
 * @param {string} locationName - Location name
 * @param {string} pluginName - Plugin name
 * @param {any=} transacting - DB transaction
 * @example
 * existLocation('users-dataset', 'plugins.users');
 * @return {Promise<boolean>}
 * */
async function existLocation(locationName, pluginName, { transacting } = {}) {
  validateLocationAndPlugin(locationName, pluginName);
  const result = await table.dataset.count({ locationName, pluginName }, { transacting });
  return !!result;
}

module.exports = existLocation;
