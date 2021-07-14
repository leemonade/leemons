const { validateNotExistSchema, validateNotExistLocation } = require('../../validations/exists');
const { validateLocationAndPlugin } = require('../../validations/dataset-location');
const { table } = require('../tables');

/** *
 *  ES:
 *  Devuelve una localiacion de un dataset
 *
 *  EN:
 *  Returns a location of a dataset
 *
 *  @public
 *  @static
 *  @param {string} locationName - Location name
 *  @param {string} pluginName - Plugin name
 *  @param {any=} transacting - DB Transaction
 *  @return {Promise<Action>} The new dataset location
 *  */
async function getSchema(locationName, pluginName, { transacting } = {}) {
  validateLocationAndPlugin(locationName, pluginName);
  await validateNotExistLocation(locationName, pluginName, { transacting });
  await validateNotExistSchema(locationName, pluginName, { transacting });

  const dataset = await table.dataset.findOne({ locationName, pluginName }, { transacting });

  dataset.jsonSchema = JSON.parse(dataset.jsonSchema);
  dataset.jsonUI = JSON.parse(dataset.jsonUI);

  return dataset;
}

module.exports = getSchema;
