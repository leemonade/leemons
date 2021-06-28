const { translations, getTranslationKey } = require('../translations');
const existSchema = require('./existSchema');
const existLocation = require('../dataset-location/existLocation');
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
  if (!(await existLocation(locationName, pluginName, { transacting })))
    throw new Error(`The '${locationName}' location not exist`);
  if (!(await existSchema(locationName, pluginName, { transacting })))
    throw new Error(`The schema for '${locationName}' location not exist`);

  const dataset = await table.dataset.findOne({ locationName, pluginName }, { transacting });

  dataset.jsonSchema = JSON.parse(dataset.jsonSchema);
  dataset.jsonUI = JSON.parse(dataset.jsonUI);

  return dataset;
}

module.exports = getSchema;
