const { validateLocationAndPlugin } = require('../../validations/dataset-location');
const { table } = require('../tables');

/**
 * ES:
 * Comprueba si existe un schema para esa localizacion
 *
 * EN:
 * Check if there is a schema for that location
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
async function existSchema(locationName, pluginName, { transacting } = {}) {
  validateLocationAndPlugin(locationName, pluginName);
  const dataset = await table.dataset.findOne({ locationName, pluginName }, { transacting });
  return dataset.jsonSchema && dataset.jsonUI;
}

module.exports = existSchema;
