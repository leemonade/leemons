const { validateNotExistSchema, validateNotExistLocation } = require('../../validations/exists');
const { validateLocationAndPlugin } = require('../../validations/datasetLocation');

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
async function getSchema({ locationName, pluginName, ctx }) {
  validateLocationAndPlugin(locationName, pluginName);
  await validateNotExistLocation({ locationName, pluginName, ctx });
  await validateNotExistSchema({ locationName, pluginName, ctx });

  const dataset = await ctx.tx.db.Dataset.findOne({ locationName, pluginName }).lean();

  dataset.jsonSchema = JSON.parse(dataset.jsonSchema);
  dataset.jsonUI = JSON.parse(dataset.jsonUI);

  return dataset;
}

module.exports = getSchema;
